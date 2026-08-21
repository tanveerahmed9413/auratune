import { Search, ScanFace, X, TableOfContents } from "lucide-react";
import { useState,useEffect } from "react";
import SongUploadCard from "../../features/home/components/SongUploadCard";
import FaceExpression from "../../features/expression/components/FaceExpression";
import MobileSidebar from "./MobileSidebar";
import { useHome } from "../../features/home/hook/useHome";

const TopBar = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchQuery,setSearchQuery] = useState("")

  const { handleGetSongsByMood, handleSearchSongs } = useHome();

// search debauncing 
  useEffect(() => {
  const timer = setTimeout(() => {
    handleSearchSongs(searchQuery);
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery]);

  const handleOpenUploadModal = () => {
    setMobileSidebar(false);
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleOpenMoodModal = () => {
    setMobileSidebar(false);
    setShowMoodModal(true);
  };

  const handleCloseMoodModal = () => {
    setShowMoodModal(false);
  };

  const handleMoodDetected = (mood) => {
    handleGetSongsByMood(mood);

    // Detection complete hone ke baad modal close
    setShowMoodModal(false);

    // Mobile sidebar bhi close rahe
    setMobileSidebar(false);
  };

  return (
    <header className="w-full px-5 py-5 lg:px-8 lg:py-5 border-b border-white/[0.05] bg-[#080c14]">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-[520px]">
          <Search
            size={21}
            strokeWidth={1.8}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchQuery}
            placeholder="Search songs, artists, albums..."
            onChange={(e) => handleSearchSongs(e.target.value)}
            className="w-full h-[52px] pl-12 pr-4 rounded-xl bg-[#0d121c] border border-white/[0.08] text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/10 transition"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Mood Detection */}
          <button
            type="button"
            onClick={handleOpenMoodModal}
            className="cursor-pointer hidden sm:flex items-center gap-2.5 h-[52px] px-5 rounded-xl bg-violet-600/[0.12] border border-violet-500/20 text-violet-300 hover:bg-violet-600/20 hover:border-violet-500/30 transition"
          >
            <ScanFace size={20} strokeWidth={1.8} />
            <span className="text-sm font-medium">Mood Detection</span>
          </button>

          {/* Create Song */}
          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="cursor-pointer hidden sm:flex items-center gap-2.5 h-[52px] px-5 rounded-xl bg-violet-600/[0.12] border border-violet-500/20 text-violet-300 hover:bg-violet-600/20 hover:border-violet-500/30 transition"
          >
            <span className="text-sm font-medium">Create Song</span>
          </button>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileSidebar(true)}
            className="sm:hidden cursor-pointer text-gray-300 hover:text-white transition"
          >
            <TableOfContents size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebar}
        onClose={() => setMobileSidebar(false)}
        onUploadClick={handleOpenUploadModal}
        onMoodClick={handleOpenMoodModal}
      />

      {/* ================= UPLOAD MODAL ================= */}

      {showUploadModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleCloseUploadModal}
        >
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleCloseUploadModal}
              className="cursor-pointer absolute right-4 top-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.1] transition"
            >
              <X size={18} />
            </button>

            <SongUploadCard onSuccess={handleCloseUploadModal} />
          </div>
        </div>
      )}

      {/* ================= MOOD DETECTION MODAL ================= */}

      {showMoodModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleCloseMoodModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleCloseMoodModal}
              className="cursor-pointer absolute right-4 top-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.1] transition"
            >
              <X size={18} />
            </button>

            {/* Face Expression */}
            <FaceExpression onMoodDetected={handleMoodDetected} />
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
