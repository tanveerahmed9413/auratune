import { Outlet } from "react-router-dom";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import BottomPlayer from "./BottomPlayer";
import FaceExpression from "../../features/expression/components/FaceExpression";
import { useHome } from "../../features/home/hook/useHome";

// Normal flex layout (no stacked fixed elements), so nothing overlaps:
// [sidebar] | [topbar / (list + scanner) / player]
const MainLayout = () => {
  const { recommendForExpression } = useHome();

  return (
    <div className="h-dvh flex overflow-hidden bg-ink text-white">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <div className="flex-1 min-h-0 flex gap-6 px-4 sm:px-6 lg:px-8 pt-4">
          <main className="flex-1 min-w-0 min-h-0 overflow-y-auto scrollbar-none">
            <Outlet />
          </main>

          {/* Scanner lives here on wide screens; below xl it opens from the top bar */}
          <aside className="hidden xl:block w-[320px] shrink-0 pb-4 overflow-y-auto scrollbar-none">
            <FaceExpression onMoodDetected={recommendForExpression} />
          </aside>
        </div>

        <BottomPlayer />
      </div>
    </div>
  );
};

export default MainLayout;
