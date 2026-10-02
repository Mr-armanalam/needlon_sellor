import { orders } from "../data/recent-orderData";
import CstnamePrdinfo from "../components/custome-name-product";
import MetaValueNmicroAction from "../components/meta-value-n-micro-action";

const OrderListCont = () => {
  return (
    <div className="bg-white border border-neutral-100/80 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
      <div className="divide-y divide-neutral-100/70">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200 hover:bg-neutral-50/40"
          >
            <CstnamePrdinfo order={order} />
            <MetaValueNmicroAction order={order} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListCont;
