import React from "react";

const VibeStatement = ({ quote }: { quote: string }) => {
  return (
    <section className="py-14 px-4 md:px-8">
      <div className="max-w-4xl mx-auto rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/50 border border-stone-200/70 dark:border-stone-800/80 p-8 md:p-12 text-center shadow-xs">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-px bg-[#D4AF37]/60" />
          <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">Philosophy</span>
          <div className="w-12 h-px bg-[#D4AF37]/60" />
        </div>
        
        <blockquote className="text-stone-900 dark:text-stone-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-garamond italic font-normal leading-relaxed md:leading-snug">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6 rounded-full" />
      </div>
    </section>
  );
};

export default VibeStatement;
