import type { LucideIcon } from "lucide-react";

export interface WelcomeIconBadgeMetric {
  icon: LucideIcon;
  color: string;
  change: string;
  isImgDanger?: boolean;
}

const WelcomeIconBadge = ({ metric }: { metric: WelcomeIconBadgeMetric }) => {
  const Icon = metric.icon;

  return (
    <div className="flex items-center justify-between w-full">
      <div
        className={`p-2.5 rounded-xl ${metric.color} transition-transform duration-300 group-hover:scale-105`}
      >
        <Icon size={18} strokeWidth={2.5} />
      </div>

      {/* Badge */}
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full font-bold tracking-tight ${
          metric.isImgDanger
            ? "bg-amber-50 text-amber-700 animate-pulse"
            : "bg-neutral-50 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-200"
        }`}
      >
        {metric.change}
      </span>
    </div>
  );
};

export default WelcomeIconBadge;
