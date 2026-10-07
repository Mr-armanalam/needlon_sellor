import { FileText } from "lucide-react";
import React from "react";

const HeadingPrice = () => {
  return (
    <section className="pt-8 pb-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-stone-600/30 dark:border-white/60 rounded-sm">
          <FileText className="w-4 h-4 text-stone-600 dark:text-white/60" />
          <span className="text-stone-600 dark:text-white/60 text-sm tracking-widest font-bold uppercase">
            Price List
          </span>
        </div>
        <h1
          className="text-[#1A1D2E] dark:text-gray-300 mb-6 text-5xl md:text-6xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Alterations Price List 2026
        </h1>
        <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
          Note: The prices below may be different depending on the fabric
          (leather, embroidery, beads, sequins, etc) or other original details.
        </p>
      </div>
    </section>
  );
};

export default HeadingPrice;
