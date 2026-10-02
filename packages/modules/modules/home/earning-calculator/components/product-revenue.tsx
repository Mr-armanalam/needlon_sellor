import React from "react";
import Eastimation from "./Eastimation";
import { ArrowRight } from "lucide-react";

const ProductRevenue = ({monthlyIncome, yearlyIncome}:{monthlyIncome:number, yearlyIncome:number}) => {
  return (
    <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 md:col-span-5 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <Eastimation monthlyIncome={monthlyIncome} yearlyIncome={yearlyIncome} />

      <button className="mt-8 w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 group">
        Start Selling Free
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
};

export default ProductRevenue;
