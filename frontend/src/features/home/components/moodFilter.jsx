import React from "react";

const moods = [
  "all",
  "sad",
  "happy",
  "energetic",
  "angry",
  "calm",
  "surprised",
  "neutral",
];

const MoodFilter = ({ selectedMood = "all", onMoodChange }) => {
  return (
    <div className="w-full min-w-0 flex flex-row overflow-x-auto scrollbar-none">
      <div className="flex flex-row gap-2">
        {moods.map((mood) => {
          const isActive = selectedMood === mood;

          return (
            <button
              key={mood}
              type="button"
              onClick={() => onMoodChange(mood)}
              className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:bg-blue-500/10 hover:text-white"
              }`}
            >
              {mood}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodFilter;