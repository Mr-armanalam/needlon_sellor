import { metricsType } from "../data/performance-snapData";

const SparkInlineCont = ({ metric }: { metric: metricsType }) => {
  
  // Normalize points to render inside a clean minimal inline SVG sparkline
  const min = Math.min(...metric.sparkline);
  const max = Math.max(...metric.sparkline);
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

      {/* Highly Polished SVG Mini-Sparkline */}
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
    </div>
  );
};

export default SparkInlineCont;
