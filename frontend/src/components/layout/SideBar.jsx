import { Home, Smile } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      className="
        w-[245px] min-h-screen
        bg-[#080c14]
        border-r border-white/[0.08]
        flex flex-col
        px-7 py-8
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        {/* Moodify Logo */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute w-1 h-5 bg-violet-500 rounded-full left-1" />
          <div className="absolute w-1 h-8 bg-violet-500 rounded-full left-3" />
          <div className="absolute w-1 h-10 bg-violet-400 rounded-full left-5" />
          <div className="absolute w-1 h-6 bg-violet-500 rounded-full left-7" />
          <div className="absolute w-1 h-4 bg-violet-400 rounded-full left-9" />
        </div>

        <h1 className="text-[24px] font-semibold text-white tracking-tight">
          Moodify
        </h1>
      </div>

      {/* Navigation */}
      <nav>
        <Link to="/">
          <div
            className="
            flex items-center gap-4
            h-[54px]
            px-4
            rounded-xl
            bg-gradient-to-r from-violet-700/80 to-violet-900/60
            border border-violet-500/20
            shadow-[0_8px_30px_rgba(109,40,217,0.18)]
            text-violet-200 cursor-pointer
          "
          >
            <Home size={22} strokeWidth={1.8} className="text-violet-200" />

            <span className="text-[16px] font-medium">Home</span>
          </div>
        </Link>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Current Mood */}
      <div
        className="
          relative
          rounded-2xl
          border border-white/[0.08]
          bg-gradient-to-br from-[#111622] to-[#0b0f18]
          px-5 pt-5 pb-4
          overflow-hidden
        "
      >
        {/* Heading */}
        <p className="text-white text-[14px] font-medium mb-5">Current Mood</p>

        {/* Mood */}
        <div className="flex items-center gap-3">
          {/* Happy Icon */}
          <div
            className="
              w-11 h-11
              rounded-full
              bg-violet-500
              flex items-center justify-center
              shadow-[0_0_25px_rgba(139,92,246,0.35)]
            "
          >
            <Smile size={27} strokeWidth={1.8} className="text-white" />
          </div>

          <span className="text-white text-[19px] font-medium">Happy</span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-[13px] mt-3">
          Let's keep the good vibes!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
