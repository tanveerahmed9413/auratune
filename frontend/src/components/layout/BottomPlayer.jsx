import { useEffect, useRef, useState } from "react";
import { SkipBack, SkipForward, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useHome } from "../../features/home/hook/useHome";
import { getMoodMeta } from "../../constants/moods";

const formatTime = (t) => {
  if (!t || Number.isNaN(t)) return "0:00";
  return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
};

const BottomPlayer = () => {
  const { currentSong, nextSong, previousSong, isPlaying, setIsPlaying } = useHome();
  const audioRef = useRef(null);
  const nextRef = useRef(nextSong);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  // keep the latest nextSong for the "ended" listener without re-binding it
  useEffect(() => { nextRef.current = nextSong; }, [nextSong]);

  // The <audio> element is always mounted, so listeners are bound exactly once
  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => nextRef.current();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong || !audio) return;
    setCurrentTime(0);
    setDuration(0);
    audio.src = currentSong.songUrl;
    audio.play().catch(() => setIsPlaying(false)); // autoplay may be blocked
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: "AuraTune",
        artwork: [{ src: currentSong.posterUrl }],
      });
    }
  }, [currentSong, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (e) => {
    const t = Number(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;
  const meta = currentSong ? getMoodMeta(currentSong.mood) : null;

  return (
    <div className={currentSong ? "shrink-0 px-3 sm:px-6 lg:px-8 pb-3 pt-2" : "hidden"}>
      <audio ref={audioRef} preload="metadata" />

      {currentSong && (
        <div className="rounded-2xl border border-violet-500/25 bg-[#0b101c]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.12)] px-4 py-3 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Song info */}
            <div className="flex items-center gap-3 min-w-0 flex-1 lg:flex-none lg:w-[28%]">
              <img src={currentSong.posterUrl} alt="" className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <h3 className="text-sm lg:text-base font-semibold truncate">{currentSong.title}</h3>
                <p className={`text-xs capitalize truncate ${meta.text}`}>{currentSong.mood || "Unknown mood"}</p>
              </div>
            </div>

            {/* Controls + (desktop) progress */}
            <div className="flex flex-col items-center gap-2 lg:flex-1">
              <div className="flex items-center gap-4 sm:gap-6">
                <button onClick={previousSong} aria-label="Previous" className="cursor-pointer text-gray-300 hover:text-violet-300 transition">
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="w-11 h-11 cursor-pointer rounded-full flex items-center justify-center bg-violet-600 shadow-[0_0_28px_rgba(124,58,237,0.5)] hover:bg-violet-500 active:scale-95 transition">
                  {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
                </button>
                <button onClick={nextSong} aria-label="Next" className="cursor-pointer text-gray-300 hover:text-violet-300 transition">
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-3 w-full max-w-[560px]">
                <span className="w-9 text-right text-xs text-gray-400 tabular-nums">{formatTime(currentTime)}</span>
                <input type="range" className="seek flex-1" aria-label="Seek" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={seek} style={{ "--p": `${pct}%` }} />
                <span className="w-9 text-xs text-gray-400 tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume (desktop) */}
            <div className="hidden lg:flex items-center gap-2 w-[16%] justify-end">
              <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="cursor-pointer text-gray-400 hover:text-white transition">
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input type="range" className="seek w-24" aria-label="Volume" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(e) => { setMuted(false); setVolume(Number(e.target.value)); }} style={{ "--p": `${(muted ? 0 : volume) * 100}%` }} />
            </div>
          </div>

          {/* Mobile progress */}
          <div className="lg:hidden mt-2.5 flex items-center gap-2">
            <span className="w-8 text-[10px] text-gray-500 tabular-nums">{formatTime(currentTime)}</span>
            <input type="range" className="seek flex-1" aria-label="Seek" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={seek} style={{ "--p": `${pct}%` }} />
            <span className="w-8 text-right text-[10px] text-gray-500 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomPlayer;
