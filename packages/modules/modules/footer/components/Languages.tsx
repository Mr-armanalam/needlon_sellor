import { Globe } from "lucide-react";

const Languages = () => {
  return (
    <div className="space-y-4 pt-4 md:pt-0">
      <h5 className="text-xs font-bold text-slate-200 tracking-widest uppercase flex items-center gap-2">
        <Globe size={14} className="text-indigo-400" /> Languages
      </h5>
      <div className="flex gap-3 text-xs font-bold">
        <button className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-medium shadow-sm">
          English
        </button>
        <button className="px-3 py-1.5 bg-slate-900/40 border border-slate-900 rounded-lg hover:border-slate-800 hover:text-white transition-all font-medium">
          हिन्दी
        </button>
      </div>
    </div>
  );
};

export default Languages;
