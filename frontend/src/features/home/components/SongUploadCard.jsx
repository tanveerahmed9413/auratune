import { useRef, useState } from "react";
import { Music2, Upload, FileAudio, X } from "lucide-react";
import { useHome } from "../hook/useHome";
import { getErrorMessage } from "../../../lib/api";
import { MOODS } from "../../../constants/moods";

const MAX_MB = 50;

const SongUploadCard = ({ onSuccess }) => {
  const { uploadLoading, handleUploadSong } = useHome();
  const inputRef = useRef(null);
  const [songFile, setSongFile] = useState(null);
  const [mood, setMood] = useState("auto");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const pickFile = (file) => {
    setError("");
    if (!file) return;
    const isMp3 =
      file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3");
    if (!isMp3) return setError("Only MP3 files are supported.");
    if (file.size > MAX_MB * 1024 * 1024)
      return setError(`File is too large. Max ${MAX_MB} MB.`);
    setSongFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!songFile) return setError("Please select an MP3 file first.");
    setError("");
    try {
      await handleUploadSong(songFile, mood);
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err, "Upload failed. Please try again."));
    }
  };

  return (
    <div className="w-full max-w-xl animate-pop">
      <div className="rounded-2xl border border-white/[0.08] bg-panel p-6 sm:p-8 shadow-[0_0_40px_rgba(79,70,229,0.12)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-600/15 border border-violet-500/20">
            <Music2 size={22} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Upload song</h2>
            <p className="text-xs text-gray-500">
              Mood is detected from the audio automatically
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label
            htmlFor="upload-song"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={`group flex flex-col items-center justify-center w-full h-44 rounded-xl border border-dashed cursor-pointer transition-all ${
              dragging
                ? "border-violet-400 bg-violet-500/10"
                : "border-white/[0.14] bg-ink hover:border-violet-500/50 hover:bg-violet-500/[0.03]"
            }`}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-violet-600/10 border border-violet-500/20 group-hover:bg-violet-600/20 transition">
              <Upload size={24} className="text-violet-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-200">
              Choose or drop an MP3
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Needs title and cover art in its tags · max {MAX_MB} MB
            </p>
            <input
              ref={inputRef}
              type="file"
              id="upload-song"
              accept=".mp3,audio/mpeg"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>

          {songFile && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-600/10 shrink-0">
                <FileAudio size={19} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate">
                  {songFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(songFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => {
                  setSongFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="cursor-pointer text-gray-500 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div>
            <label
              htmlFor="mood"
              className="block text-xs font-medium text-gray-400 mb-2"
            >
              Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full h-11 rounded-xl bg-ink border border-white/[0.1] px-3 text-sm text-white outline-none focus:border-violet-500/60 capitalize"
            >
              <option value="auto">Auto-detect (recommended)</option>
              {MOODS.filter((m) => m !== "all").map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={uploadLoading}
            className="cursor-pointer w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.99] text-sm font-medium text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(124,58,237,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            {uploadLoading ? "Analyzing & uploading..." : "Upload song"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SongUploadCard;
