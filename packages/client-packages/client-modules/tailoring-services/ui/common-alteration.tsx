"use client";
import { alterationType } from "@/data/service-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommonAlteration = () => {
  return (
    <section className="bg-white dark:bg-transparent py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">Quick Pricing</span>
          <h2 className="text-stone-900 dark:text-stone-100 mt-2 mb-4 text-3xl sm:text-4xl md:text-5xl font-garamond font-normal leading-tight">
            Most Requested Services
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed">
            Quick turnaround on everyday alterations that make the biggest
            difference to your silhouette.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {alterationType.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-stone-900 dark:text-stone-100 mb-2 font-garamond font-medium text-xl">
                  {item.title}
                </h4>
                <p className="text-stone-600 dark:text-stone-300 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">Starting at</span>
                <span className="text-[#D4AF37] font-semibold text-base font-garamond">
                  From ₹{item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <p className="text-stone-600 dark:text-stone-300 text-sm mb-3">
            Looking for bespoke custom garment alterations?
          </p>
          <Link
            href="/services/tailoring/mens"
            className="text-[#D4AF37] hover:text-[#b8952b] transition-colors inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <span>Explore Bespoke Tailoring Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommonAlteration;
