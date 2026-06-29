import { ordersType } from "../data/recent-orderData";

const CstnamePrdinfo = ({order}:{order:ordersType}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-semibold text-neutral-700 text-[13px] tracking-wider shadow-inner">
        {order.initials}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-neutral-900 tracking-tight">
            {order.customer}
          </span>
          <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100/80 px-1.5 py-0.5 rounded-md">
            {order.id}
          </span>
        </div>
        <span className="text-[13px] text-neutral-500 font-normal tracking-tight line-clamp-1">
          {order.product}
        </span>
      </div>
    </div>
  );
};

export default CstnamePrdinfo;
