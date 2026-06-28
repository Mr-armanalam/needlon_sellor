import { Bell, Globe } from "lucide-react";

const LagnuagesAndNotification = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Language Selector */}
      <button className="p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60 transition-all duration-200 flex items-center justify-center">
        <Globe size={18} />
      </button>

      <button className="relative p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60 transition-all duration-200 flex items-center justify-center">
        <Bell size={18} />
        {/* Active red indicator dot */}
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-neutral-900 rounded-full ring-2 ring-white animate-pulse" />
      </button>
    </div>
  );
};

export default LagnuagesAndNotification;
