import React from "react";

const PlanType = () => {
  return (
    <div className="text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 border-b border-slate-100">
      <div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Premium Merchant Plan
        </h3>
        <p className="text-slate-500 text-xs font-medium mt-1">
          Everything you need to launch and scale locally from home.
        </p>
      </div>

      <div className="flex items-baseline justify-center gap-1">
        <span className="text-xl font-bold text-slate-900">₹</span>
        <span className="text-5xl font-black text-slate-900 tracking-tight font-mono">
          99
        </span>
        <span className="text-slate-400 text-sm font-semibold">/month</span>
      </div>
    </div>
  );
};

export default PlanType;
