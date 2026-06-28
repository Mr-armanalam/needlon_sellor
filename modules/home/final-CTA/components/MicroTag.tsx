import { Sparkles } from "lucide-react";

const MicroTag = () => {
  return (
    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-indigo-200 text-xs font-semibold tracking-wide shadow-sm">
      <Sparkles size={13} className="text-amber-400 animate-pulse" />
      <span>0% Commission • Setup takes less than 2 minutes</span>
    </div>
  );
};

export default MicroTag;
