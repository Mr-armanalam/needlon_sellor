import Logo from "./components/logo";
import BottomNavigation from "./ui/bottom-navigation";
import SideBarNavigation from "./ui/sidebar-navigation";

export default function Sidebar() {
  return (
    <aside className="w-70 h-screen bg-[#FAFAFA] border-r border-gray-100 flex flex-col justify-between p-5 font-sans select-none tracking-tight">
      
      <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <Logo />
        <hr className="border-gray-200 mx-3" />
        {/* Main Navigation */}
        <SideBarNavigation />
      </div>

      {/* Bottom Section: Footer Actions */}
      <div className="flex flex-col gap-4 mt-6">
        <hr className="border-gray-200 mx-3" />
        <BottomNavigation />
      </div>
      
    </aside>
  );
}
