import { weddingTimelinedata } from "@/data/service-data";
import React from "react";

const WeddingTimeline = () => {
  return (
    <section id="timeline" className="bg-[#FAF8F5] dark:bg-stone-900/30 border-y border-stone-200/60 dark:border-stone-800/60 py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">Preparation Guide</span>
          <h2 className="text-stone-900 dark:text-stone-100 mt-2 mb-4 text-3xl sm:text-4xl md:text-5xl font-garamond font-normal leading-tight">
            Your Wedding Timeline
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed">
            We recommend beginning the tailoring process well in advance to
            ensure an effortless, stress-free experience before the big day.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-[#D4AF37]/30 dark:border-[#D4AF37]/20 ml-6 md:ml-8 space-y-12 py-4">
            {weddingTimelinedata?.map((data, i) => (
              <div key={i} className="relative pl-8 md:pl-10 group">
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white dark:bg-stone-900 border-2 border-[#D4AF37] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-garamond font-medium mb-3">
                    {data.time}
                  </div>
                  <h4 className="text-stone-900 dark:text-stone-100 mb-2 text-xl font-garamond font-medium">
                    {data.title}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                    {data.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingTimeline;
