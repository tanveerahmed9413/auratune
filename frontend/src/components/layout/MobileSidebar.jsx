import { Home, Search, Upload, ScanFace, User, X, Music2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const MobileSidebar = ({ isOpen, onClose, onUploadClick, onMoodClick }) => {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      name: "Search",
      icon: Search,
      path: "/search",
    },
    {
      name: "Upload Song",
      icon: Upload,
      action: "upload",
    },
    {
      name: "Mood Detection",
      icon: ScanFace,
      action: "mood",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleUploadClick = () => {
    onClose();
    onUploadClick();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[100] w-[280px] bg-[#080c14] border-r border-white/[0.08] shadow-[10px_0_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out sm:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-[90px] px-5 flex items-center justify-between border-b border-white/[0.05]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-600/15 border border-violet-500/20">
              <Music2 size={21} className="text-violet-400" />
            </div>

            <div>
              <h2 className="text-white font-semibold">Moodify</h2>
              <p className="text-[11px] text-gray-500">Feel the music</p>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.action === "upload") {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onClose();
                    onUploadClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent cursor-pointer"
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </button>
              );
            }

            if (item.action === "mood") {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onClose();
                    onMoodClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent cursor-pointer"
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-violet-600/15 border border-violet-500/20 text-violet-300"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl p-4 bg-violet-600/[0.06] border border-violet-500/[0.08]">
            <p className="text-xs text-gray-500">Moodify</p>
            <p className="text-sm text-gray-300 mt-1">Your music, your mood.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
