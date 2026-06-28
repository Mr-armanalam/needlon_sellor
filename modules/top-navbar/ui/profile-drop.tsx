import { ChevronDown } from "lucide-react";
import React from "react";

const ProfileDrop = () => {
  return (
    <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-neutral-100/50 transition-all duration-200 group outline-none">
      <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden shadow-sm border border-neutral-200/20">
        {/* Fallback Initials or Avatar Image */}
        <span className="text-white text-[13px] font-semibold tracking-wider">
          AR
        </span>
      </div>
      <div className="hidden md:flex flex-col items-start gap-0">
        <span className="text-[13px] font-medium text-neutral-800 tracking-tight group-hover:text-neutral-900">
          Arman
        </span>
      </div>
      <ChevronDown
        size={14}
        className="text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 group-hover:translate-y-0.5"
      />
    </button>
  );
};

export default ProfileDrop;
