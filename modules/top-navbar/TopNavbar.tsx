import Greetings from "./components/greetings";
import Searchbar from "./ui/searchbar";
import LagnuagesAndNotification from "./components/lagnuagesAndNotification";
import ProfileDrop from "./ui/profile-drop";

export default function TopHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-gray-100/80 px-8 py-4 flex items-center justify-between transition-all duration-200">
      <Greetings />

      <div className="flex items-center gap-6">
        <Searchbar />
        <LagnuagesAndNotification />

        <div className="h-5 w-px bg-neutral-200/60" />
        <ProfileDrop />
      </div>
    </header>
  );
}
