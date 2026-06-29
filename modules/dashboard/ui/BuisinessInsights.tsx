import { Sparkles } from "lucide-react";
import RecommendationStack from "../view/recommendation-stack";

export default function BusinessInsights() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title Container */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
          <Sparkles size={14} />
        </div>
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Smart Insights
        </h3>
      </div>

      <RecommendationStack />
    </div>
  );
}
