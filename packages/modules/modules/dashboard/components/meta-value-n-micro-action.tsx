import { ordersType } from "../data/recent-orderData";
import { RecentOrderOverviewDto } from "../dto/dashboard.dto";
import MetaValueQuickAction from "./meta-value-quick-process";

interface MetaValueNmicroActionProps {
  order: RecentOrderOverviewDto | ordersType;
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onChat?: (orderId: string) => void;
  isLoading?: boolean;
}

const MetaValueNmicroAction = ({
  order,
  onAccept,
  onDecline,
  onChat,
  isLoading = false,
}: MetaValueNmicroActionProps) => {
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

      <MetaValueQuickAction
        orderId={order.id}
        status={order.status}
        onAccept={onAccept}
        onDecline={onDecline}
        onChat={onChat}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MetaValueNmicroAction;

