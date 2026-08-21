import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

export default function FaceExpression({onMoodDetected }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Click button to scan");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef })
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error("Initialization error:", err);
        setExpression("Model ya Camera load nahi hua! ⚠️");
      });

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="mt-7 w-full rounded-2xl border border-white/10 bg-linear-to-br from-[#111827] via-[#0d1220] to-violet-950/40 p-5 text-white shadow-[0_0_40px_rgba(124,58,237,0.12)] flex flex-col items-center justify-center">
      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-[280px] rounded-2xl bg-[#1f2937] object-cover scale-x-[-1]"
      />

      {/* Expression */}
      <div className="mt-5 flex flex-col items-center">
        <h2 className="m-0 text-center text-2xl font-bold text-white">
          {isLoading ? "Loading Model assets..." : expression}
        </h2>

        {/* Button */}
        <button
          disabled={isLoading}
          onClick={() => {
            detect({
              landmarkerRef,
              videoRef,
              setExpression,
              onMoodDetected,
            });
          }}
          className={`mt-5 rounded-xl border-none px-6 py-3 text-base font-semibold text-white transition-all ${
            isLoading
              ? "cursor-not-allowed bg-gray-600"
              : "cursor-pointer bg-violet-600 hover:bg-violet-500 active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          }`}
        >
          {isLoading ? "Please Wait..." : "Detect Expression"}
        </button>
      </div>
    </div>
  );
}
