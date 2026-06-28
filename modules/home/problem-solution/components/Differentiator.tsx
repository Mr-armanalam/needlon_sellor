import { ArrowRight } from "lucide-react";
import { TransformationDataType } from "../../data/transformationData";

const Differentiator = ({ item }: { item: TransformationDataType}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
      <div className="opacity-60 group-hover:opacity-75 transition-opacity">
        <span className="text-xs font-semibold text-rose-600 tracking-wider uppercase block mb-1">
          The Problem
        </span>
        <p className="text-sm font-medium text-black line-through decoration-rose-300 decoration-2">
          {item.problem}
        </p>
      </div>

      <div className="relative pt-4 sm:pt-0 sm:pl-6 sm:border-l sm:border-slate-100">
        <ArrowRight
          size={16}
          className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 text-slate-300 bg-white"
        />

        <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase block mb-1">
          The Solution
        </span>
        <p className="text-sm font-semibold text-slate-900">{item.solution}</p>
      </div>
    </div>
  );
};

export default Differentiator;
