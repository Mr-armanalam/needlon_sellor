import React from "react";

const Eastimation = ({monthlyIncome, yearlyIncome}:{monthlyIncome:number, yearlyIncome:number}) => {
  return (
    <div>
      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-white/10 px-2.5 py-1 rounded-full inline-block mb-6">
        Your Projected Revenue
      </span>

      <div className="space-y-1">
        <span className="text-xs text-slate-400 font-medium block">
          Estimated Monthly Income
        </span>
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-1">
          <span className="text-2xl md:text-3xl font-sans font-bold text-indigo-400">
            ₹
          </span>
          {monthlyIncome.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Added High Impact Bonus: Yearly Income Projection */}
      <div className="mt-6 pt-6 border-t border-white/10 space-y-1 opacity-80">
        <span className="text-xs text-slate-400 font-medium block">
          Yearly Profit Potential
        </span>
        <div className="text-xl font-bold tracking-tight text-emerald-400 font-mono">
          ₹{yearlyIncome.toLocaleString("en-IN")} / year
        </div>
      </div>
    </div>
  );
};

export default Eastimation;
