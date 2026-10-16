import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { aggregate, classify, scoreExpressions, toScoreMap } from "./expression";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// wasm is copied from node_modules into /public by scripts/copy-wasm.mjs
const WASM_URL = `${import.meta.env.BASE_URL}mediapipe/wasm`;

let landmarkerPromise = null;

/** Load the model once and share it (survives StrictMode double-mount). */
export const loadLandmarker = () => {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      const make = (delegate) =>
        FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
      try {
        return await make("GPU");
      } catch {
        return await make("CPU");
      }
    })().catch((err) => {
      landmarkerPromise = null; // allow retry
      throw err;
    });
  }
  return landmarkerPromise;
};

export const startCamera = async (videoEl) => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera is not supported in this browser (HTTPS required).");
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
    audio: false,
  });
  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
};

export const stopCamera = (stream, videoEl) => {
  stream?.getTracks().forEach((t) => t.stop());
  if (videoEl) videoEl.srcObject = null;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Scan the face for `durationMs`, sampling many frames, then classify the
 * averaged result. A single frame is noisy (blinks, mid-motion), many are not.
 */
export const scanExpression = async ({
  landmarker,
  video,
  durationMs = 2500,
  onProgress,
  signal,
}) => {
  const frames = [];
  let missed = 0;
  let lastVideoTime = -1;
  const start = performance.now();

  while (performance.now() - start < durationMs) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    onProgress?.(Math.min((performance.now() - start) / durationMs, 1));

    if (video.readyState >= 2 && video.videoWidth > 0 && video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const res = landmarker.detectForVideo(video, performance.now());
      const categories = res.faceBlendshapes?.[0]?.categories;
      if (categories?.length) frames.push(scoreExpressions(toScoreMap(categories)));
      else missed++;
    }
    await wait(60);
  }
  onProgress?.(1);

  if (frames.length < 5) {
    return { ok: false, reason: "no-face", frames: frames.length, missed };
  }

  const scores = aggregate(frames);
  const { expression, confidence } = classify(scores);
  return { ok: true, expression, confidence, scores, frames: frames.length };
};
