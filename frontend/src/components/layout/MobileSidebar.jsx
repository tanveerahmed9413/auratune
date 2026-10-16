import { Home, Upload, ScanFace, LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";
import { MoodCard } from "./SideBar";
import { useAuth } from "../../features/auth/hooks/useAuth";

const itemClass =
  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-gray-300 hover:text-white hover:bg-white/[0.05] border border-transparent cursor-pointer";

// Drawer for screens below `lg` (where the desktop sidebar is hidden)
const MobileSidebar = ({ isOpen, onClose, onUploadClick, onMoodClick }) => {
  const { user, handleLogout } = useAuth();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        aria-label="Menu"
        aria-hidden={!isOpen}
        className={`fixed top-0 left-0 bottom-0 z-[100] w-[280px] max-w-[85vw] flex flex-col bg-ink border-r border-white/[0.08] shadow-[10px_0_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-white/[0.05]">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer">
            <X size={19} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) => `${itemClass} ${isActive ? "!bg-violet-600/15 !border-violet-500/20 !text-violet-200" : ""}`}
          >
            <Home size={19} strokeWidth={1.8} /> Home
          </NavLink>
          <button type="button" className={itemClass} onClick={() => { onClose(); onUploadClick(); }}>
            <Upload size={19} strokeWidth={1.8} /> Upload song
          </button>
          <button type="button" className={`${itemClass} xl:hidden`} onClick={() => { onClose(); onMoodClick(); }}>
            <ScanFace size={19} strokeWidth={1.8} /> Mood scanner
          </button>
        </nav>

        <div className="p-4 space-y-3">
          <MoodCard />
          <button type="button" className={itemClass} onClick={() => { onClose(); handleLogout(); }}>
            <LogOut size={19} strokeWidth={1.8} />
            <span className="truncate">Log out{user?.username ? ` (${user.username})` : ""}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
