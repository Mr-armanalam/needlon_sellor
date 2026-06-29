import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { metricsType } from "../data/performance-snapData";

const PerformanceHeaderTrendInd = ({ metric }: { metric: metricsType }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-neutral-400 tracking-tight">
        {metric.title}
      </span>

      <div
        className={`flex items-center gap-0.5 text-[12px] font-bold tracking-tight ${
          metric.isPositive ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {metric.isPositive ? (
          <ArrowUpRight size={14} />
        ) : (
          <ArrowDownRight size={14} />
        )}
        <span>{metric.change}</span>
      </div>
    </div>
  );
};

export default PerformanceHeaderTrendInd;
