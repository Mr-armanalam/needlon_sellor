import { metrics } from "../data/performance-snapData";
import PerformanceMetricCard from "../view/performance-metric-card";

export default function PerformanceSnapshot() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Performance Snapshot
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          return <PerformanceMetricCard metric={metric} key={idx} />;
        })}
      </div>
    </div>
  );
}
