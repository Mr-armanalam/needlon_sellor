import { Ruler, Settings, Zap } from "lucide-react";
import React from "react";

const AlterationChooseUs = () => {
  return (
    <section className="bg-white dark:bg-transparent py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">Our Guarantee</span>
          <h2 className="text-stone-900 dark:text-stone-100 mt-2 mb-4 text-3xl sm:text-4xl md:text-5xl font-garamond font-normal leading-tight">
            Why Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6 group-hover:scale-105 transition-transform">
              <Ruler className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-stone-900 dark:text-stone-100 mb-3 text-xl font-garamond font-medium">
              Precision First
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              We measure twice, cut once. Every alteration is executed with
              meticulous attention to detail and technical craftsmanship.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6 group-hover:scale-105 transition-transform">
              <Zap className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-stone-900 dark:text-stone-100 mb-3 text-xl font-garamond font-medium">
              Quick Turnaround
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              Standard alterations completed within 5-7 working days. Express
              service available for immediate wedding or event needs.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6 group-hover:scale-105 transition-transform">
              <Settings className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-stone-900 dark:text-stone-100 mb-3 text-xl font-garamond font-medium">
              All Garments Welcome
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              From high-street to haute couture, vintage treasures to contemporary fashion— we
              work with garments at every price point with equal dedication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlterationChooseUs;
