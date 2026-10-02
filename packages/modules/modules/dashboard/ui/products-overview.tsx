import { Plus } from "lucide-react";
import DashboardProductCont from "../view/dashboard-products-container";

export default function ProductsOverview() {

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Your Products
        </h3>
        <button className="text-[13px] font-medium text-neutral-900 hover:text-neutral-600 flex items-center gap-1 transition-all">
          <Plus size={14} strokeWidth={2.5} /> Add product
        </button>
      </div>

      {/* Horizontal Scroll Track Wrapper */}
      <DashboardProductCont />
    </div>
  );
}