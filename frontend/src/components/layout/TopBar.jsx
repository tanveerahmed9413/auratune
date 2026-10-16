import { useEffect, useState } from "react";
import { Search, ScanFace, X, Menu, Upload } from "lucide-react";
import SongUploadCard from "../../features/home/components/SongUploadCard";
import FaceExpression from "../../features/expression/components/FaceExpression";
import MobileSidebar from "./MobileSidebar";
import { useHome } from "../../features/home/hook/useHome";

const Modal = ({ onClose, maxWidth = "max-w-xl", children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className={`relative w-full ${maxWidth} max-h-[90dvh] overflow-y-auto scrollbar-none`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer absolute right-3 top-3 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.12] transition"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

const actionBtn =
  "cursor-pointer items-center gap-2.5 h-11 px-4 rounded-xl bg-violet-600/[0.12] border border-violet-500/20 text-violet-200 hover:bg-violet-600/20 hover:border-violet-500/30 transition text-sm font-medium";

const TopBar = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { recommendForExpression, searchQuery, setSearchQuery } = useHome();

  const handleMoodDetected = (expression, confidence) => {
    recommendForExpression(expression, confidence);
    setShowMood(false);
  };

  return (
    <header className="shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-white/[0.05] bg-ink">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden cursor-pointer w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-gray-300 hover:text-white bg-white/[0.04] border border-white/[0.08] transition">
          <Menu size={20} />
        </button>

        <div className="relative flex-1 max-w-[520px]">
          <Search size={19} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs..."
            aria-label="Search songs"
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-panel border border-white/[0.08] text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/10 transition"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button type="button" onClick={() => setShowMood(true)} className={`hidden sm:flex xl:hidden ${actionBtn}`}>
            <ScanFace size={18} strokeWidth={1.8} /> Scan mood
          </button>
          <button type="button" onClick={() => setShowUpload(true)} className={`hidden sm:flex ${actionBtn}`}>
            <Upload size={18} strokeWidth={1.8} /> Upload song
          </button>
        </div>
      </div>

      <MobileSidebar
        isOpen={drawer}
        onClose={() => setDrawer(false)}
        onUploadClick={() => setShowUpload(true)}
        onMoodClick={() => setShowMood(true)}
      />

      {showUpload && (
        <Modal onClose={() => setShowUpload(false)}>
          <SongUploadCard onSuccess={() => setShowUpload(false)} />
        </Modal>
      )}

      {showMood && (
        <Modal onClose={() => setShowMood(false)} maxWidth="max-w-md">
          <FaceExpression onMoodDetected={handleMoodDetected} autoCloseMs={1600} />
        </Modal>
      )}
    </header>
  );
};

export default TopBar;
