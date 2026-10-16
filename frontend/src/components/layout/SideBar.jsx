import { Home, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";
import { useHome } from "../../features/home/hook/useHome";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { getMoodMeta } from "../../constants/moods";

export const MoodCard = () => {
  const { detected } = useHome();
  const expression = detected?.expression;
  const meta = expression ? getMoodMeta(expression) : null;

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#111622] to-[#0b0f18] p-5 overflow-hidden">
      {meta && <div className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${meta.glow} to-transparent blur-2xl`} />}
      <p className="relative text-[13px] text-gray-400 mb-3">Current mood</p>
      <div className="relative flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-violet-500/90 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.35)]">
          {meta ? <meta.icon size={26} strokeWidth={1.8} className="text-white" /> : <span className="text-lg">?</span>}
        </div>
        <span className="text-white text-[17px] font-medium whitespace-nowrap">{meta ? meta.label : "Not scanned"}</span>
      </div>
      <p className="relative text-gray-400 text-[13px] mt-3">
        {meta ? meta.tagline : "Scan your face to get songs that fit."}
      </p>
    </div>
  );
};

const Sidebar = () => {
  const { user, handleLogout } = useAuth();

  return (
    <aside className="hidden lg:flex w-[245px] shrink-0 h-full flex-col bg-ink border-r border-white/[0.08] px-6 py-7">
      <div className="mb-10"><Logo /></div>

      <nav aria-label="Main">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 h-12 px-4 rounded-xl border transition ${
              isActive
                ? "bg-gradient-to-r from-violet-700/80 to-violet-900/60 border-violet-500/20 text-violet-100 shadow-[0_8px_30px_rgba(109,40,217,0.18)]"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/[0.04]"
            }`
          }
        >
          <Home size={20} strokeWidth={1.8} />
          <span className="font-medium">Home</span>
        </NavLink>
      </nav>

      <div className="flex-1" />

      <MoodCard />

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <div className="w-8 h-8 shrink-0 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-sm font-semibold uppercase">
          {user?.username?.[0] || "U"}
        </div>
        <p className="flex-1 min-w-0 truncate text-sm text-gray-200">{user?.username}</p>
        <button type="button" onClick={handleLogout} aria-label="Log out" title="Log out" className="cursor-pointer text-gray-500 hover:text-white transition">
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
