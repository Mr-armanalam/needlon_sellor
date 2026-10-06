"use client";

import { Copy, Edit3, Share2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SubtleUtilitiesProps {
  productId?: string;
  productSlug?: string;
  onDuplicate?: (productId: string) => void;
  isLoadingDuplicate?: boolean;
}

const SubtleUtilities = ({
  productId,
  productSlug,
  onDuplicate,
  isLoadingDuplicate = false,
}: SubtleUtilitiesProps) => {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/products");
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId && onDuplicate) {
      onDuplicate(productId);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/product/${productSlug || productId || "preview"}`
      : "";
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard!");
    } else {
      toast.success(`Product link: ${url}`);
    }
  };

  return (
    <div className="flex items-center justify-between gap-1 mt-1">
      <button
        type="button"
        onClick={handleEdit}
        className="flex-1 py-2 text-[12px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Edit3 size={13} /> Edit
      </button>

      <button
        type="button"
        title="Duplicate product"
        disabled={isLoadingDuplicate}
        onClick={handleDuplicate}
        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        {isLoadingDuplicate ? (
          <Loader2 size={13} className="animate-spin text-neutral-600" />
        ) : (
          <Copy size={13} />
        )}
      </button>

      <button
        type="button"
        title="Share link"
        onClick={handleShare}
        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all duration-200 cursor-pointer"
      >
        <Share2 size={13} />
      </button>
    </div>
  );
};

export default SubtleUtilities;

