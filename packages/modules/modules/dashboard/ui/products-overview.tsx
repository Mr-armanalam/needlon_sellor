"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardProductCont from "../view/dashboard-products-container";
import { DashboardProductDto } from "../dto/dashboard.dto";

interface ProductsOverviewProps {
  products?: DashboardProductDto[];
  onDuplicate?: (productId: string) => void;
  actionLoadingMap?: Record<string, boolean>;
}

export default function ProductsOverview({
  products,
  onDuplicate,
  actionLoadingMap,
}: ProductsOverviewProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Your Products
        </h3>
        <button
          onClick={() => router.push("/products")}
          className="text-[13px] font-medium text-neutral-900 hover:text-neutral-600 flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} /> Add product
        </button>
      </div>

      {/* Horizontal Scroll Track Wrapper */}
      <DashboardProductCont
        products={products}
        onDuplicate={onDuplicate}
        actionLoadingMap={actionLoadingMap}
      />
    </div>
  );
}