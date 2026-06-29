import { ordersType } from "../data/recent-orderData";
import MetaValueQuickAction from "./meta-value-quick-process";

const MetaValueNmicroAction = ({ order }: { order: ordersType }) => {
  return (
    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none pt-3 sm:pt-0 border-neutral-50">
      <div className="flex flex-col sm:items-end gap-0.5">
        <span className="text-[15px] font-bold text-neutral-900 tracking-tight">
          {order.amount}
        </span>
        <span className="text-[12px] text-neutral-400 font-normal tracking-tight">
          {order.time}
        </span>
      </div>

      <MetaValueQuickAction />
    </div>
  );
};

export default MetaValueNmicroAction;
