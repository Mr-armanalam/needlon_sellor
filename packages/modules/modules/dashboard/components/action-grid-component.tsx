import { ArrowUpRight } from "lucide-react";
import { actionType } from "../data/quickActionData";

const ActionGridComp = ({ action }: { action: actionType }) => {
  const Icon = action.icon;

  return (
    <button
      className={`
        group flex flex-col justify-between items-start text-left p-5 rounded-2xl h-35
        transition-all duration-300 ease-out outline-none select-none relative overflow-hidden
        hover:-translate-y-0.5  ${action.styles}
      `}
    >
      {/* Dynamic Icon Wrapper */}
      <div
        className={`p-2 rounded-xl transition-transform duration-300 group-hover:scale-105 ${action.iconStyles}`}
      >
        <Icon size={18} strokeWidth={action.isPrimary ? 3 : 2.5} />
      </div>

      {/* Text Meta Container */}
      <div className="flex flex-col gap-0.5 mt-4 z-10">
        <span className="text-[15px] font-semibold tracking-tight">
          {action.title}
        </span>
        <span
          className={`text-[12px] tracking-tight line-clamp-1 transition-colors duration-200 ${
            action.isPrimary ? "text-neutral-300" : "text-neutral-500/90"
          }`}
        >
          {action.description}
        </span>
      </div>

      {/* Decorative Arrow Indicator for secondary cards */}
      {!action.isPrimary && (
        <div className="absolute right-4 top-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <ArrowUpRight
            size={14}
            className={
              action.isPrimary ? "text-neutral-400" : "text-neutral-400"
            }
          />
        </div>
      )}
    </button>
  );
};

export default ActionGridComp;
