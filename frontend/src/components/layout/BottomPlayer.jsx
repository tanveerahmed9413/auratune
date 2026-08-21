import { SkipBack, SkipForward, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHome } from "../../features/home/hook/useHome";

// =========================
// FORMAT TIME
// =========================

const formatTime = (time) => {
  if (!time || isNaN(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);

  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const BottomPlayer = () => {
  const { currentSong, nextSong, previousSong } = useHome();

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  // =========================
  // CURRENT SONG CHANGE
  // =========================

  useEffect(() => {
    if (!currentSong) return;

    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();

    audio.src = currentSong.songUrl;

    audio.load();

    setCurrentTime(0);
    setDuration(0);

    // Song select hone ke baad autoplay
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log("Autoplay blocked:", error);

        setIsPlaying(false);
      });
  }, [currentSong]);

  // =========================
  // AUDIO EVENTS
  // =========================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      // Automatically next song
      nextSong();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [nextSong]);

  // =========================
  // PLAY / PAUSE
  // =========================

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio || !currentSong) return;

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
      });
    } else {
      audio.pause();

      setIsPlaying(false);
    }
  };

  // =========================
  // NO SONG
  // =========================

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-3 right-3 lg:left-[260px] z-50 rounded-2xl border border-violet-500/30 bg-[#0b101c]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.12)] text-white">
      {/* REAL AUDIO */}

      <audio ref={audioRef} />

      {/* ========================= */}
      {/* DESKTOP */}
      {/* ========================= */}

      <div className="hidden lg:flex h-[100px] items-center gap-6 px-10">
        {/* SONG INFO */}

        <div className="flex items-center gap-5 min-w-[300px]">
          <img
            src={currentSong.posterUrl}
            alt={currentSong.title}
            className="w-[60px] h-[60px] rounded-xl object-cover"
          />

          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold truncate">
              {currentSong.title}
            </h3>

            <p className="text-gray-400 mt-1 capitalize">
              {currentSong.mood || "Unknown mood"}
            </p>
          </div>
        </div>

        {/* CENTER */}

        <div className="flex-1 flex flex-col items-center gap-5">
          {/* CONTROLS */}

          <div className="flex items-center gap-8">
            {/* PREVIOUS */}

            <button
              onClick={previousSong}
              className="text-white cursor-pointer hover:text-violet-400 transition"
            >
              <SkipBack size={22} fill="currentColor" />
            </button>

            {/* PLAY / PAUSE */}

            <button
              onClick={togglePlay}
              className="w-[50px] h-[50px] cursor-pointer rounded-full flex items-center justify-center bg-violet-600 shadow-[0_0_30px_rgba(124,58,237,0.55)] hover:bg-violet-500 transition"
            >
              {isPlaying ? (
                <Pause size={24} fill="white" />
              ) : (
                <Play size={24} fill="white" />
              )}
            </button>

            {/* NEXT */}

            <button
              onClick={nextSong}
              className="text-white cursor-pointer hover:text-violet-400 transition"
            >
              <SkipForward size={22} fill="currentColor" />
            </button>
          </div>

          {/* PROGRESS */}

          <div className="flex items-center gap-3 w-full max-w-[550px]">
            <span className="text-xs text-gray-400">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);

                audioRef.current.currentTime = time;

                setCurrentTime(time);
              }}
              className="flex-1 accent-violet-500"
            />

            <span className="text-xs text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* MOBILE / TABLET */}
      {/* ========================= */}

      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center gap-3">
          {/* IMAGE */}

          <img
            src={currentSong.posterUrl}
            alt={currentSong.title}
            className="w-[52px] h-[52px] rounded-lg object-cover flex-shrink-0"
          />

          {/* INFO */}

          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold truncate">
              {currentSong.title}
            </h3>

            <p className="text-xs text-gray-400 mt-0.5 truncate capitalize">
              {currentSong.mood || "Unknown mood"}
            </p>
          </div>

          {/* PREVIOUS */}

          <button onClick={previousSong} className="text-gray-300">
            <SkipBack size={18} />
          </button>

          {/* PLAY */}

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-600"
          >
            {isPlaying ? (
              <Pause size={18} fill="white" />
            ) : (
              <Play size={18} fill="white" />
            )}
          </button>

          {/* NEXT */}

          <button onClick={nextSong} className="text-gray-300">
            <SkipForward size={18} />
          </button>
        </div>

        {/* MOBILE PROGRESS */}

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-gray-500">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const time = Number(e.target.value);

              audioRef.current.currentTime = time;

              setCurrentTime(time);
            }}
            className="flex-1 accent-violet-500"
          />

          <span className="text-[10px] text-gray-500">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;
