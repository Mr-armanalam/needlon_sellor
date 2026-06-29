import { ArrowUpRight } from "lucide-react";
import { metrics } from "../data/welcomeData";
import WelcomeIconBadge from "../components/welcome-icon-badge";
import WelcomeBottomTextMetric from "../components/welcome-bottom-text-metric";

export default function WelcomeCard() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, index) => {
          return (
            <div
              key={index}
              className="group relative bg-white border border-neutral-100/80 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.01)]"
            >
              <WelcomeIconBadge metric={metric} />
              <WelcomeBottomTextMetric metric={metric} />

              {/* Soft aesthetic background accent link on hover */}
              <div className="absolute right-4 bottom-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                <ArrowUpRight size={14} className="text-neutral-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
