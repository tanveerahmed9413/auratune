import { Smile, Frown, Angry, Meh, Zap, Wind, Sparkles, Music } from "lucide-react";

export const MOODS = ["all", "happy", "sad", "energetic", "angry", "calm", "surprised", "neutral"];

// Visual identity per mood (used by chips, cards, sidebar, scanner)
export const MOOD_META = {
  happy: { label: "Happy", icon: Smile, text: "text-amber-300", chip: "bg-amber-400/10 border-amber-400/20 text-amber-300", glow: "from-amber-400/25", tagline: "Let's keep the good vibes going!" },
  sad: { label: "Sad", icon: Frown, text: "text-sky-300", chip: "bg-sky-400/10 border-sky-400/20 text-sky-300", glow: "from-sky-400/25", tagline: "Soft songs for a heavy moment." },
  angry: { label: "Angry", icon: Angry, text: "text-rose-300", chip: "bg-rose-400/10 border-rose-400/20 text-rose-300", glow: "from-rose-400/25", tagline: "Let it out, loud and clear." },
  surprised: { label: "Surprised", icon: Sparkles, text: "text-fuchsia-300", chip: "bg-fuchsia-400/10 border-fuchsia-400/20 text-fuchsia-300", glow: "from-fuchsia-400/25", tagline: "Something unexpected, let's match it." },
  neutral: { label: "Neutral", icon: Meh, text: "text-slate-300", chip: "bg-slate-400/10 border-slate-400/20 text-slate-300", glow: "from-slate-400/20", tagline: "Easy listening for a steady mood." },
  energetic: { label: "Energetic", icon: Zap, text: "text-orange-300", chip: "bg-orange-400/10 border-orange-400/20 text-orange-300", glow: "from-orange-400/25", tagline: "High energy, full volume." },
  calm: { label: "Calm", icon: Wind, text: "text-emerald-300", chip: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300", glow: "from-emerald-400/25", tagline: "Slow down and breathe." },
};

export const getMoodMeta = (mood) =>
  MOOD_META[mood] || { label: mood || "Unknown", icon: Music, text: "text-violet-300", chip: "bg-violet-400/10 border-violet-400/20 text-violet-300", glow: "from-violet-400/25", tagline: "Your music, your mood." };
