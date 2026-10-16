import { MOODS, getMoodMeta } from "../../../constants/moods";

const MoodFilter = ({ selectedMood = "all", onMoodChange }) => (
  <div className="w-full min-w-0 overflow-x-auto scrollbar-none" role="tablist" aria-label="Filter songs by mood">
    <div className="flex flex-row sm:flex-wrap gap-2 pr-2">
      {MOODS.map((mood) => {
        const active = selectedMood === mood;
        const Icon = mood === "all" ? null : getMoodMeta(mood).icon;
        return (
          <button
            key={mood}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onMoodChange(mood)}
            className={`shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-sm font-medium capitalize transition-all cursor-pointer border ${
              active
                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/25"
                : "bg-white/[0.04] border-white/[0.08] text-gray-400 hover:bg-violet-500/10 hover:text-white"
            }`}
          >
            {Icon && <Icon size={14} />}
            {mood}
          </button>
        );
      })}
    </div>
  </div>
);

export default MoodFilter;
