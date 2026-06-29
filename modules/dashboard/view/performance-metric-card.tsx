import PerformanceHeaderTrendInd from "../components/performance-header-trend-indicator";
import SparkInlineCont from "../components/spark-inline-container";
import { metricsType } from "../data/performance-snapData";

const PerformanceMetricCard = ({ metric }: { metric: metricsType }) => {
  return (
    <div className="bg-white border border-neutral-100/80 p-5 rounded-2xl flex flex-col justify-between gap-2 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)]">
      <PerformanceHeaderTrendInd metric={metric} />
      <SparkInlineCont metric={metric} />
    </div>
  );
};

export default PerformanceMetricCard;
