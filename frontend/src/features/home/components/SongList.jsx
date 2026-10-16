import { useEffect } from "react";
import { Music2, X, ScanFace, Search } from "lucide-react";
import SongCard from "./SongCard";
import MoodFilter from "./MoodFilter";
import { useHome } from "../hook/useHome";
import { getMoodMeta } from "../../../constants/moods";

const SongList = () => {
  const {
    songs, loading, loaded, error, getSongs,
    currentSong, isPlaying, playSong, selectedMood, handleMoodFilter,
    detected, clearDetected, searchQuery, setSearchQuery,
  } = useHome();

  useEffect(() => {
    if (!loaded) getSongs();
  }, [loaded, getSongs]);

  const first = !loaded || (loading && songs.length === 0);
  const meta = detected ? getMoodMeta(detected.expression) : null;
  const hasFilters = Boolean(searchQuery.trim()) || selectedMood !== "all";
  const emptyTitle = searchQuery.trim()
    ? `No songs match "${searchQuery.trim()}"`
    : selectedMood !== "all"
      ? `No ${selectedMood} songs yet`
      : "Your library is empty";

  return (
    <section aria-label="Your music library" className="flex flex-col min-w-0 h-full">
      {/* Filter bar stays mounted while loading so it never flickers */}
      <div className="sticky top-0 z-10 shrink-0 bg-ink/95 backdrop-blur pt-1 pb-4">
        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Your listening space</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white">Your soundtrack</h1>
            <p className="mt-1 text-sm text-gray-400">Find the right sound for right now.</p>
          </div>
          <span
            aria-live="polite"
            className="mt-1 shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-300"
          >
            {songs.length} {songs.length === 1 ? "track" : "tracks"}
          </span>
        </div>

        <MoodFilter selectedMood={selectedMood} onMoodChange={handleMoodFilter} />

        {detected && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.07] px-3 sm:px-4 py-3 animate-pop">
            <ScanFace size={18} className={meta.text} />
            <p className="flex-1 min-w-0 text-sm leading-relaxed text-gray-200">
              You look <b className={`capitalize ${meta.text}`}>{detected.expression}</b>
              {detected.fallback
                ? ". No songs match yet, so showing everything."
                : <> · showing <span className="capitalize">{detected.moods.join(" + ")}</span> songs</>}
            </p>
            <button type="button" onClick={clearDetected} aria-label="Clear mood" className="cursor-pointer text-gray-400 hover:text-white transition">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="music-scroll min-h-0 flex-1" aria-busy={loading}>
        {first ? (
          <div className="space-y-2 py-1" role="status" aria-label="Loading songs">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} aria-hidden="true" className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-panel px-4 py-3">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-white/[0.06]" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-2/5 animate-pulse rounded bg-white/[0.08]" />
                  <div className="h-2.5 w-1/4 animate-pulse rounded bg-white/[0.05]" />
                </div>
                <div className="h-7 w-16 animate-pulse rounded-full bg-white/[0.06]" />
              </div>
            ))}
            <span className="sr-only">Loading your music library…</span>
          </div>
        ) : error ? (
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-rose-400/15 bg-rose-400/[0.04] px-5 py-8 text-center sm:px-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/[0.08]">
              <Music2 className="text-rose-300" size={22} />
            </div>
            <h2 className="font-medium text-white">We couldn’t load your songs</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{error}</p>
            <button
              type="button"
              onClick={getSongs}
              className="mt-5 min-h-10 cursor-pointer rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Try again
            </button>
          </div>
        ) : songs.length === 0 ? (
          <div className="mx-auto my-8 max-w-lg rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-5 py-10 text-center sm:px-8 sm:py-14">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-600/10">
              {searchQuery.trim() ? <Search size={24} className="text-violet-300" /> : <Music2 className="text-violet-300" size={26} />}
            </div>
            <h2 className="text-lg font-semibold text-white">{emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-400">
              {hasFilters
                ? "Try a different search or mood to find something to play."
                : "Add a few favorites to get started. We’ll detect each song’s mood automatically."}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  handleMoodFilter("all");
                }}
                className="mt-5 min-h-10 cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Clear filters
              </button>
            ) : (
              <p className="mt-4 text-xs text-gray-500">Choose <span className="text-gray-300">Upload song</span> from the menu to add music.</p>
            )}
          </div>
        ) : (
          <div className={`flex flex-col gap-2 pb-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
            {loading && <p className="sr-only" role="status">Updating songs…</p>}
            {songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onPlay={() => playSong(song)}
                isActive={currentSong?._id === song._id}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SongList;
