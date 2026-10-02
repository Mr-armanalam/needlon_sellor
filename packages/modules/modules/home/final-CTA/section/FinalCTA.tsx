import { ArrowRight } from "lucide-react";
import RadialGlowEffect from "../components/RadialGlowEffect";
import MicroTag from "../components/MicroTag";
import CTAHeading from "../components/CTAHeading";

export default function FinalCTA() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto w-full">
      <div className="relative rounded-[32px] bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden px-6 py-20 md:py-28 text-center shadow-[0_24px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-900">
        <RadialGlowEffect />

        <div className="relative max-w-3xl mx-auto space-y-6 md:space-y-8 z-10">
          <MicroTag />
          <CTAHeading />

          <p className="text-slate-300 text-base md:text-xl font-medium max-w-xl mx-auto leading-relaxed opacity-90">
            Join thousands of women boutique owners building independent
            storefronts and growing their income.
          </p>

          <div className="pt-4">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-950 font-extrabold text-base px-8 py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group">
              Start Selling Free
              <ArrowRight
                size={18}
                strokeWidth={2.5}
                className="text-indigo-600 group-hover:translate-x-1.5 transition-transform duration-200"
              />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            No credit card mandatory to launch trial • Cancel anytime with
            1-click
          </p>
        </div>
      </div>
    </section>
  );
}
