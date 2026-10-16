import { useCallback, useEffect, useRef, useState } from "react";
import { ScanFace, RefreshCw, Camera, AlertTriangle } from "lucide-react";
import { loadLandmarker, scanExpression, startCamera, stopCamera } from "../utils/utils";
import { getMoodMeta } from "../../../constants/moods";

const BAR_ORDER = ["happy", "sad", "angry", "surprised", "neutral"];

export default function FaceExpression({ onMoodDetected, autoCloseMs = 0 }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  // idle | loading | scanning | done | error
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const releaseCamera = useCallback(() => {
    stopCamera(streamRef.current, videoRef.current);
    streamRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      releaseCamera(); // always turn the camera off when leaving
    };
  }, [releaseCamera]);

  const scan = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResult(null);
    setMessage("");
    setProgress(0);
    setPhase("loading");

    try {
      const [landmarker] = await Promise.all([
        loadLandmarker(),
        (async () => {
          releaseCamera();
          streamRef.current = await startCamera(videoRef.current);
        })(),
      ]);
      if (controller.signal.aborted || !mountedRef.current) return releaseCamera();

      await new Promise((r) => setTimeout(r, 500)); // let auto-exposure settle
      setPhase("scanning");

      const res = await scanExpression({ landmarker, video: videoRef.current, onProgress: setProgress, signal: controller.signal });
      if (!mountedRef.current) return;

      releaseCamera(); // privacy: camera off as soon as we have a result

      if (!res.ok) {
        setPhase("error");
        setMessage("I couldn't see your face. Face the camera in good light and try again.");
        return;
      }
      setResult(res);
      setPhase("done");
      if (autoCloseMs > 0) {
        setTimeout(() => mountedRef.current && onMoodDetected?.(res.expression, res.confidence), autoCloseMs);
      } else {
        onMoodDetected?.(res.expression, res.confidence);
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      releaseCamera();
      console.error("Expression scan failed:", err);
      setPhase("error");
      setMessage(
        err?.name === "NotAllowedError"
          ? "Camera permission was blocked. Allow camera access in your browser and try again."
          : err?.name === "NotFoundError"
            ? "No camera found on this device."
            : "Could not load the face model or camera. Check your connection and try again.",
      );
    }
  };

  const busy = phase === "loading" || phase === "scanning";
  const meta = result ? getMoodMeta(result.expression) : null;
  const ringStyle = { background: `conic-gradient(#8b5cf6 ${progress * 360}deg, rgba(255,255,255,0.08) 0deg)` };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#0d1220] to-violet-950/40 p-5 text-white shadow-[0_0_40px_rgba(124,58,237,0.12)]">
      <div className="flex items-center gap-2 mb-4">
        <ScanFace size={18} className="text-violet-400" />
        <h3 className="text-sm font-semibold">Mood scanner</h3>
      </div>

      {/* Camera frame (always mounted so the ref exists) */}
      <div className="relative mx-auto w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden bg-[#1f2937]/70 border border-white/10">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity ${busy ? "opacity-100" : "opacity-0"}`}
        />
        {phase === "scanning" && (
          <div className="absolute inset-3 rounded-xl border-2 border-violet-400/70 animate-pulse pointer-events-none" />
        )}
        {!busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
            {phase === "done" && meta ? (
              <>
                <meta.icon size={52} className={meta.text} />
                <p className={`text-2xl font-bold capitalize ${meta.text}`}>{result.expression}</p>
                <p className="text-xs text-gray-400">{Math.round(result.confidence * 100)}% confident</p>
              </>
            ) : phase === "error" ? (
              <>
                <AlertTriangle size={34} className="text-amber-300" />
                <p className="text-xs text-gray-300 leading-relaxed">{message}</p>
              </>
            ) : (
              <>
                <Camera size={34} className="text-gray-500" />
                <p className="text-xs text-gray-400">Camera starts only when you scan</p>
              </>
            )}
          </div>
        )}
        {phase === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-gray-200">Starting camera & model...</div>
        )}
      </div>

      {/* Scan progress */}
      {phase === "scanning" && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gray-300">
          <div className="w-6 h-6 rounded-full p-[3px]" style={ringStyle}><div className="w-full h-full rounded-full bg-[#0d1220]" /></div>
          Hold your expression...
        </div>
      )}

      {/* Score bars (explains *why* it picked that mood) */}
      {phase === "done" && result && (
        <div className="mt-4 space-y-1.5" aria-label="Expression scores">
          {BAR_ORDER.map((name) => {
            const pct = Math.round(Math.min(result.scores[name], 1) * 100);
            const m = getMoodMeta(name);
            return (
              <div key={name} className="flex items-center gap-2 text-[11px]">
                <span className="w-16 capitalize text-gray-400">{name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <div className={`h-full rounded-full ${name === result.expression ? "bg-violet-500" : "bg-white/30"}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`w-8 text-right ${name === result.expression ? m.text : "text-gray-500"}`}>{pct}%</span>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={scan}
        className={`mt-5 w-full h-11 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          busy ? "cursor-not-allowed bg-gray-600" : "cursor-pointer bg-violet-600 hover:bg-violet-500 active:scale-[0.98] shadow-[0_0_20px_rgba(124,58,237,0.3)]"
        }`}
      >
        {phase === "done" || phase === "error" ? <RefreshCw size={16} /> : <ScanFace size={16} />}
        {busy ? "Scanning..." : phase === "done" || phase === "error" ? "Scan again" : "Scan my mood"}
      </button>
      <p className="mt-3 text-center text-[11px] text-gray-500">Processed in your browser. Video is never uploaded.</p>
    </div>
  );
}
