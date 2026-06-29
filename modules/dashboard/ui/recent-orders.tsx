import { ArrowRight } from "lucide-react";
import OrderListCont from "../view/order-list-container";

export default function RecentOrders() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Container */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Recent Activity
        </h3>
        <button className="text-[13px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-1 group">
          View all orders
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <OrderListCont />
    </div>
  );
}
