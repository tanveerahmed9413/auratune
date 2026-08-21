import {
  FilesetResolver,
  FaceLandmarker,
  FaceDetector,
} from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });
  streamRef = await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = streamRef;
  await videoRef.current.play();
  // detect();
};
export const detect = ({
  landmarkerRef,
  videoRef,
  setExpression,
  onMoodDetected,
}) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now(),
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;
    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");

    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");

    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    const browDownLeft = getScore("browDownLeft");
    const browDownRight = getScore("browDownRight");

    const smile = (smileLeft + smileRight) / 2;
    const frown = (frownLeft + frownRight) / 2;
    const browDown = (browDownLeft + browDownRight) / 2;

    let currentExpression = "neutral";
    let mood = "neutral";

    if (jawOpen > 0.2 && browUp > 0.2) {
      currentExpression = "surprised";
      mood = "surprised";
    } else if (frown > 0.15 || browDown > 0.15) {
      currentExpression = "sad";
      mood = "sad";
    } else if (smile > 0.3) {
      currentExpression = "happy";
      mood = "happy";
    }

    console.log({ smile, frown, browDown, jawOpen, browUp });
    setExpression(currentExpression);
    if (onMoodDetected) {
      onMoodDetected(mood);
    }
  }
};
