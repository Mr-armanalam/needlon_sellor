import { serviceStepMens } from "@/data/service-data";
import React from "react";

const ProcessSection = ({
  title,
  subtitle,
  processStep,
  bg,
}: {
  title: string;
  subtitle?: string;
  processStep: typeof serviceStepMens;
  bg?: string;
}) => {
  return (
    <section
      id="process"
      className={`${
        bg ?? "bg-[#FAF8F5] dark:bg-stone-900/30"
      } border-y border-stone-200/60 dark:border-stone-800/60 py-20 px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">
              Step-by-Step
            </span>
          </div>
          <h2 className="text-stone-900 dark:text-stone-100 mb-4 text-3xl sm:text-4xl md:text-5xl font-garamond font-normal leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processStep?.map((item, index) => (
            <div
              key={item.step || index}
              className="relative p-6 rounded-xl bg-white dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 mb-5 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-[#D4AF37] text-xl font-garamond font-medium">
                  {item.step}
                </span>
              </div>
              <h4 className="text-stone-900 dark:text-stone-100 font-garamond font-medium text-lg sm:text-xl mb-2.5">
                {item.name}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
