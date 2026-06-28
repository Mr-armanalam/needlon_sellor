import { ArrowRight } from "lucide-react";

const PricingCTA = () => {
  return (
    <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
      {/* UPDATED: Button is now high-converting Brand Indigo to draw the eye immediately */}
      <button className="w-full sm:flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 group">
        Start Your 40-Day Free Trial
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>

      <div className="text-center sm:text-left max-w-[200px]">
        <p className="text-[11px] text-slate-400 font-medium leading-normal">
          Cancel anytime within 40 days and pay absolutely nothing.
        </p>
      </div>
    </div>
  );
};

export default PricingCTA;
