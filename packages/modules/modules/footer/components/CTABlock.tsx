import { ArrowRight } from "lucide-react";

const CTABlock = () => {
  return (
    <div className="relative rounded-[24px] bg-linear-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 md:p-12 text-center overflow-hidden shadow-2xl">
      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-serif">
          Ready to Start Your Business?
        </h3>
        <p className="text-sm text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
          Join thousands of local home entrepreneurs across India and start
          selling your clothing collection today.
        </p>
        <div className="pt-2">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 group shadow-lg shadow-indigo-600/10">
            Start Selling Free
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
      {/* Subtle Background Light Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-37.5 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
};

export default CTABlock;
