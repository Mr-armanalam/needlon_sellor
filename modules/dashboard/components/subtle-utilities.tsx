import { Copy, Edit3, Share2 } from "lucide-react";

const SubtleUtilities = () => {
  return (
    <div className="flex items-center justify-between gap-1 mt-1">
      <button className="flex-1 py-2 text-[12px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5">
        <Edit3 size={13} /> Edit
      </button>

      <button
        title="Duplicate product"
        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all duration-200"
      >
        <Copy size={13} />
      </button>

      <button
        title="Share link"
        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all duration-200"
      >
        <Share2 size={13} />
      </button>
    </div>
  );
};

export default SubtleUtilities;
