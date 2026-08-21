import React, { useState } from "react";
import { Music2, Upload, FileAudio } from "lucide-react";
import { useHome } from "../hook/useHome";

const SongUploadCard = ({ onSuccess }) => {
  const [songFile, setSongFile] = useState(null);

  const { uploadLoading, handleUploadSong } = useHome();

  const handleFileChange = (e) => {
    let file = e.target.files[0];

    if (!file) return;
    setSongFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!songFile) {
      alert("Please select a song");
      return;
    }

    await handleUploadSong(songFile);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d121c] p-6 sm:p-8 shadow-[0_0_40px_rgba(79,70,229,0.08)]">
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-600/15 border border-violet-500/20">
              <Music2 size={22} className="text-violet-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Upload Song</h2>

              <p className="text-xs text-gray-500">
                Add a new song to your Moodify library
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div>
            <label
              htmlFor="upload-song"
              className="group relative flex flex-col items-center justify-center w-full h-48 rounded-xl border border-dashed border-white/[0.12] bg-[#080c14] hover:border-violet-500/50 hover:bg-violet-500/[0.03] cursor-pointer transition-all"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-violet-600/10 border border-violet-500/20 group-hover:bg-violet-600/20 transition">
                <Upload
                  size={24}
                  className="text-violet-400 group-hover:scale-110 transition"
                />
              </div>

              <h3 className="mt-4 text-sm font-medium text-gray-200">
                Choose a song
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Click to browse your audio files max 10 MB
              </p>

              <span className="mt-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-500">
                Only MP3
              </span>

              <input
                type="file"
                name="upload-song"
                id="upload-song"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Selected File */}
          {/* <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-600/10">
              <FileAudio size={19} className="text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate">No song selected</p>

              <p className="text-xs text-gray-600 mt-0.5">
                Select an audio file to continue
              </p>
            </div>
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            className="cursor-pointer w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.99] text-sm font-medium text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(124,58,237,0.25)] transition-all"
          >
            <Upload size={18} />
            {uploadLoading ? "Uploading..." : "Upload Song"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SongUploadCard;
