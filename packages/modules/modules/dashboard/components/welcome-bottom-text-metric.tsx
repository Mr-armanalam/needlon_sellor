import { WelcomeMetricDto } from "../dto/dashboard.dto";

const WelcomeBottomTextMetric = ({
  metric,
}: {
  metric: Pick<WelcomeMetricDto, "title" | "value">;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-400 tracking-tight">
        {metric.title}
      </span>
      <span className="text-[22px] font-bold text-neutral-900 tracking-tight">
        {metric.value}
      </span>
    </div>
  );
};

export default WelcomeBottomTextMetric;
