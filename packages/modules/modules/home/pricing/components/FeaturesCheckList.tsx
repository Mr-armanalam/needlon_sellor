import { Check } from "lucide-react";
import React from "react";

const FeaturesCheckList = ({premiumFeatures}:{premiumFeatures:string[]}) => {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
        What&apos;s included in the plan:
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {premiumFeatures.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-slate-700 text-sm font-medium"
          >
            <div className="mt-0.5 p-1 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesCheckList;
