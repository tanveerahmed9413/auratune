import React from "react";
import { Home, Music2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Music Icon */}
        <div className="mx-auto mb-7 w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.15)]">
          <Music2
            size={38}
            className="text-violet-400"
          />
        </div>

        {/* 404 */}
        <h1 className="text-[100px] sm:text-[130px] leading-none font-black tracking-tight bg-gradient-to-r from-violet-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-5 text-2xl sm:text-3xl font-bold">
          This track couldn't be found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Looks like you've wandered off the playlist. The page you're
          looking for doesn't exist or may have been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

          {/* Home */}
          <Link
            to="/"
            className="w-full sm:w-auto px-6 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 transition flex items-center justify-center gap-2 text-sm font-medium shadow-[0_0_25px_rgba(124,58,237,0.25)]"
          >
            <Home size={17} />
            Back to Home
          </Link>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition flex items-center justify-center gap-2 text-sm font-medium text-gray-300 cursor-pointer"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

        </div>

        {/* Brand */}
        <div className="mt-10 flex items-center justify-center gap-2 text-gray-600">
          <Music2 size={15} />
          <span className="text-xs tracking-wide">
            Moodify
          </span>
        </div>

      </div>
    </div>
  );
};

export default NotFound;