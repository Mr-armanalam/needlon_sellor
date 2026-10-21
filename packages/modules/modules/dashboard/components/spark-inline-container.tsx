import { metricsType } from "../data/performance-snapData";

const SparkInlineCont = ({ metric }: { metric: metricsType }) => {
  const hasSeries = metric.sparkline.length >= 2;

  // Normalize points to render inside a clean minimal inline SVG sparkline
  const min = hasSeries ? Math.min(...metric.sparkline) : 0;
  const max = hasSeries ? Math.max(...metric.sparkline) : 0;
  const points = metric.sparkline
    .map((val, index) => {
      const x = (index / (metric.sparkline.length - 1)) * 80;
      const y = 25 - ((val - min) / (max - min || 1)) * 20;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex items-end justify-between mt-2">
      <span className="text-[20px] font-bold text-neutral-900 tracking-tight">
        {metric.value}
      </span>

      {/* Highly Polished SVG Mini-Sparkline (only when a real series exists) */}
      {hasSeries && (
      <div className="w-20 h-6.25">
        <svg className="w-full h-full overflow-visible">
          <polyline
            fill="none"
            stroke={metric.isPositive ? "#10B981" : "#EF4444"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="transition-all duration-500"
          />
        </svg>
      </div>
      )}
    </div>
  );
};

export default SparkInlineCont;
