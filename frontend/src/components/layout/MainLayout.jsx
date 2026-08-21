import { Outlet } from "react-router-dom";

import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import BottomPlayer from "./BottomPlayer";
import FaceExpression from "../../features/expression/components/FaceExpression";
import { useHome } from "../../features/home/hook/useHome";

const MainLayout = () => {
  const { handleGetSongsByMood } = useHome();
  const handleMoodDetected = (mood) => {
    handleGetSongsByMood(mood);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#080c14] text-white">
      {/* SIDEBAR */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-50 w-[245px]">
        <Sidebar />
      </aside>

      {/* MAIN AREA */}
      <div className="h-full lg:ml-[245px]">
        {/* TOPBAR */}
        <header className="fixed top-0 right-0 left-0 lg:left-[245px] z-40">
          <Topbar />
        </header>

        {/* CONTENT AREA */}
        <div className="flex h-full pt-[90px] pb-[100px] px-4 sm:px-5 lg:px-8 gap-6">
          {/* ONLY OUTLET SCROLLS */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-none">
            <Outlet />
          </main>

          {/* FACE EXPRESSION DOES NOT SCROLL */}
          <aside className="hidden xl:block w-[320px] shrink-0 h-fit">
            <FaceExpression onMoodDetected={handleMoodDetected} />
          </aside>
        </div>
      </div>

      {/* BOTTOM PLAYER */}
      <div className="fixed bottom-3 right-0 left-0 lg:left-[245px] z-30">
        <BottomPlayer />
      </div>
    </div>
  );
};

export default MainLayout;
