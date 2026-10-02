import { LucideProps } from "lucide-react";
import React from "react";
import { stepDataType } from "../../data/stepsData";

const TimeLineGridComp = ({
  Icon,
  step,
  index,
  stepsLength,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  step: stepDataType;
  index: number;
  stepsLength: number;
}) => {
  return (
    <div className="flex flex-col items-center text-center group relative">
      {/* Step Number Badge */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-sm opacity-90">
        {step.id}
      </span>

      {/* Icon Container with Hover Animation */}
      <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.15)] transition-all duration-300 z-10">
        <Icon size={28} strokeWidth={1.75} />
      </div>

      {/* Text Content */}
      <div className="mt-5 px-2">
        <h3 className="text-md font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
          {step.title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-50 mx-auto">
          {step.description}
        </p>
      </div>

      {/* Mobile / Tablet Connector Visual (Hidden on large screens) */}
      {index !== stepsLength - 1 && (
        <div className="lg:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 text-slate-300 font-light text-xl animate-pulse">
          ↓
        </div>
      )}
    </div>
  );
};

export default TimeLineGridComp;
