import { Play } from "lucide-react";
import { getMoodMeta } from "../../../constants/moods";

const SongCard = ({ song, onPlay, isActive, isPlaying }) => {
  const meta = getMoodMeta(song.mood);
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${song.title}`}
      className={`group w-full text-left cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200 ${
        isActive
          ? "bg-violet-600/10 border-violet-500/30"
          : "bg-panel border-white/[0.06] hover:bg-[#111722] hover:border-violet-500/20"
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={song.posterUrl}
          alt=""
          loading="lazy"
          className="w-14 h-14 rounded-lg object-cover bg-white/5"
        />
        <div className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/55 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {isActive && isPlaying ? (
            <span className="flex items-end gap-[3px] h-4" aria-label="Playing">
              <i className="eq-bar block w-[3px] h-full rounded bg-white" />
              <i className="eq-bar block w-[3px] h-full rounded bg-white" />
              <i className="eq-bar block w-[3px] h-full rounded bg-white" />
            </span>
          ) : (
            <Play size={20} fill="white" className="text-white" />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className={`text-sm sm:text-base font-medium truncate ${isActive ? "text-violet-200" : "text-white"}`}>{song.title}</h2>
      </div>

      <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border capitalize ${meta.chip}`}>
        <meta.icon size={12} />
        <span className="hidden xs:inline sm:inline">{song.mood || "Unknown"}</span>
      </span>
    </button>
  );
};

export default SongCard;
