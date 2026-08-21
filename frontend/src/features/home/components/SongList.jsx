import React, { useEffect } from "react";
import SongCard from "./SongCard";
import MoodFilter from "./MoodFilter";
import { useHome } from "../hook/useHome";

const SongList = () => {
  const {
    songs,
    getSongs,
    loading,
    playSong,
    selectedMood,
    handleMoodFilter,
    searchResult,
    searchQuery,
  } = useHome();

  useEffect(() => {
    getSongs();
  }, []);

  // Search active hai to searchResult,
  // otherwise normal songs
  const displaySongs = searchQuery.trim() ? searchResult : songs;

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-7 h-7 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full min-w-0 flex flex-col">
      {/* MOOD FILTER */}
      <div className="sticky top-0 z-30 flex flex-row shrink-0 min-w-0 bg-[#080c14] py-3">
        <MoodFilter
          selectedMood={selectedMood}
          onMoodChange={handleMoodFilter}
        />
      </div>

      {/* MUSIC */}
      <div className="music-scroll min-h-0 flex-1 overflow-y-auto">
        {displaySongs.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              {searchQuery.trim()
                ? `No songs found for "${searchQuery}"`
                : `No ${
                    selectedMood !== "all" ? selectedMood : ""
                  } songs found`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displaySongs.map((song, index) => (
              <SongCard
                key={song._id}
                song={song}
                onPlay={() => playSong(song, index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongList;
