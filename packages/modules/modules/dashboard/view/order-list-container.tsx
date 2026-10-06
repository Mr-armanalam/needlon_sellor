"use client";

import { useRouter } from "next/navigation";
import { orders as defaultOrders } from "../data/recent-orderData";
import { RecentOrderOverviewDto } from "../dto/dashboard.dto";
import CstnamePrdinfo from "../components/custome-name-product";
import MetaValueNmicroAction from "../components/meta-value-n-micro-action";

interface OrderListContProps {
  orders?: RecentOrderOverviewDto[];
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onChat?: (orderId: string) => void;
  actionLoadingMap?: Record<string, boolean>;
}

const OrderListCont = ({
  orders,
  onAccept,
  onDecline,
  onChat,
  actionLoadingMap = {},
}: OrderListContProps) => {
  const router = useRouter();
  const orderList = orders && orders.length > 0 ? orders : defaultOrders;

  return (
    <div className="bg-white border border-neutral-100/80 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
      <div className="divide-y divide-neutral-100/70">
        {orderList.map((order) => (
          <div
            key={order.id}
            onClick={() => router.push(`/orders/${order.id}`)}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200 hover:bg-neutral-50/40 cursor-pointer"
          >
            <CstnamePrdinfo order={order as any} />
            <MetaValueNmicroAction
              order={order}
              onAccept={onAccept}
              onDecline={onDecline}
              onChat={onChat}
              isLoading={!!actionLoadingMap[order.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListCont;

