import { ArrowRight } from "lucide-react";
import { recommendations } from "../data/buisinessInsightData";

const RecommendationStack = () => {
  return (
    <div className="flex flex-col gap-3.5">
      {recommendations.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`
                p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 
                transition-all duration-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.01)]
                ${item.cardStyles}
              `}
          >
            {/* Left Wing: Informational Text */}
            <div className="flex items-start gap-3.5">
              <div className={`p-2 rounded-xl shrink-0 ${item.iconStyles}`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <p className="text-[14px] font-medium tracking-tight leading-relaxed pt-0.5">
                {item.message}
              </p>
            </div>

            {/* Right Wing: Inline Action Button */}
            <button
              className={`
                  px-4 py-2 text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 
                  transition-all duration-200 shrink-0 select-none outline-none group
                  ${item.buttonStyles}
                `}
            >
              <span>{item.actionLabel}</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendationStack;
