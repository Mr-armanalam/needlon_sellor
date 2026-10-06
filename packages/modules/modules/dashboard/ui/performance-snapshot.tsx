import { metrics as defaultMetrics } from "../data/performance-snapData";
import { PerformanceMetricDto } from "../dto/dashboard.dto";
import PerformanceMetricCard from "../view/performance-metric-card";

interface PerformanceSnapshotProps {
  performance?: PerformanceMetricDto[];
}

export default function PerformanceSnapshot({ performance }: PerformanceSnapshotProps) {
  const items = performance && performance.length > 0 ? performance : defaultMetrics;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Performance Snapshot
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((metric, idx) => {
          return <PerformanceMetricCard metric={metric} key={idx} />;
        })}
      </div>
    </div>
  );
}

