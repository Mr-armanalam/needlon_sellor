import { ShoppingBag } from "lucide-react";
import { DashboardProductDto } from "../dto/dashboard.dto";

const ProdLightWtMetricBar = ({
  product,
}: {
  product: Pick<DashboardProductDto, "sales">;
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 border-y border-neutral-50 py-3 my-1">
      <div className="flex flex-col items-center justify-center gap-0.5 text-neutral-400">
        <ShoppingBag size={14} />
        <span className="text-[12px] font-bold text-neutral-700 mt-0.5">
          {product.sales}
        </span>
        <span className="text-[10px] font-medium text-neutral-400">Sales</span>
      </div>
    </div>
  );
};

export default ProdLightWtMetricBar;
