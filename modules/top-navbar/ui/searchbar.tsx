import { Search } from "lucide-react";
import React from "react";

const Searchbar = () => {
  return (
    <div className="relative group w-64">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-focus-within:text-neutral-900"
      />
      <input
        type="text"
        placeholder="Search anything..."
        className="w-full pl-10 pr-4 py-2 text-[13px] font-medium text-neutral-800 placeholder-neutral-400 bg-neutral-100/50 hover:bg-neutral-100/80 focus:bg-white rounded-xl border border-transparent focus:border-neutral-200/80 outline-none transition-all duration-200 shadow-inner focus:shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
      />
      {/* Mac/Windows Shortcut hint for micro-interaction */}
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 pointer-events-none tracking-widest bg-white px-1.5 py-0.5 rounded border border-neutral-100 shadow-sm opacity-100 group-focus-within:opacity-0 transition-opacity duration-150">
        ⌘K
      </kbd>
    </div>
  );
};

export default Searchbar;
