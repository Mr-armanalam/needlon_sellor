"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  image: string;
  bespokeType: string;
  title: string;
  description: string;
}

const serviceTabs = [
  { label: "Men's Tailoring", href: "/services/tailoring/mens" },
  { label: "Women's Tailoring", href: "/services/tailoring/womens" },
  { label: "Wedding & Occasion", href: "/services/tailoring/wedding-occasion" },
  { label: "Alterations & Fit", href: "/services/alterations" },
];

const ServiceHeroSection = ({
  image,
  bespokeType,
  title,
  description,
}: Props) => {
  return (
    <div className="mx-2 md:mx-6 lg:mx-8 mt-3">
      {/* Services Sub-navigation bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-3 px-2 mb-2">
        {serviceTabs.map((tab) => {
          const isActive =
            bespokeType.toLowerCase().includes("men") && tab.href.includes("mens") ||
            bespokeType.toLowerCase().includes("women") && tab.href.includes("womens") ||
            bespokeType.toLowerCase().includes("wedding") && tab.href.includes("wedding") ||
            bespokeType.toLowerCase().includes("alteration") && tab.href.includes("alteration");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-xs md:text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-[#D4AF37] text-black font-medium border-[#D4AF37] shadow-sm"
                  : "bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Hero Banner */}
      <section className="relative min-h-[380px] md:min-h-[460px] rounded-xl flex items-center overflow-hidden shadow-sm">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Multi-stop Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-stone-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-medium tracking-widest uppercase">
                {bespokeType} Bespoke
              </span>
            </div>

            <h1 className="text-white mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-garamond font-normal leading-tight tracking-tight">
              {title}
            </h1>

            <p className="text-stone-200 text-sm md:text-base lg:text-lg mb-8 leading-relaxed font-light max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#process"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c29f2f] text-black text-xs md:text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-102"
              >
                <span>Explore the Process</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/services/alterations"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium px-5 py-3 rounded-full backdrop-blur-xs border border-white/20 transition-all duration-300"
              >
                Book Fittings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceHeroSection;
