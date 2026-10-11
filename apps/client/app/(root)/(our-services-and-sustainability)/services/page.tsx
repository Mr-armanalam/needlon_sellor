import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowRight, Scissors, Sparkles, Clock, ShieldCheck } from "lucide-react";
import VibeStatement from "@/modules/tailoring-services/ui/vibe-statement";

const servicesList = [
  {
    title: "Men's Bespoke Tailoring",
    subtitle: "The Modern Standard of Masculine Elegance",
    description:
      "Full canvassed suits, custom shirting, and luxury overcoats crafted from the world's finest European wools and Egyptian cottons.",
    image:
      "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    link: "/services/tailoring/mens",
    badge: "Bespoke Suiting",
    tag: "30+ Measurements",
  },
  {
    title: "Women's Precision Tailoring",
    subtitle: "Architectural Precision for the Modern Woman",
    description:
      "Power blazers, tailored trousers, silk shirting, and evening gowns sculpted specifically to flatter your unique silhouette and ambitions.",
    image:
      "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    link: "/services/tailoring/womens",
    badge: "Couture Cuts",
    tag: "Custom Draping",
  },
  {
    title: "Wedding & Occasionwear",
    subtitle: "Elegance Tailored to Your Greatest Moments",
    description:
      "Turn once-in-a-lifetime celebrations into timeless memories with bespoke groom suits, tuxedos, and bridal adjustments.",
    image:
      "https://images.unsplash.com/photo-1655490162630-175929877280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    link: "/services/tailoring/wedding-occasion",
    badge: "Ceremonial Wear",
    tag: "Bridal & Groom",
  },
  {
    title: "Alterations & Fittings",
    subtitle: "The Art of the Perfect 1/4 Inch Fit",
    description:
      "From hem adjustments and waist suppression to complex garment re-structuring, restore the exact fit of your favorite wardrobe pieces.",
    image:
      "https://images.unsplash.com/photo-1719563014656-802c0aa9632a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    link: "/services/alterations",
    badge: "Master Alterations",
    tag: "Quick Turnaround",
  },
];

const pillars = [
  {
    icon: Scissors,
    title: "Master Craftsmanship",
    desc: "Decades of bespoke tailoring expertise applied to every seam, stitch, and lining.",
  },
  {
    icon: Sparkles,
    title: "Curated Luxury Fabrics",
    desc: "Over 500+ premium wools, cashmeres, and silks sourced from iconic world mills.",
  },
  {
    icon: Clock,
    title: "Reliable Timelines",
    desc: "Strict adherence to agreed delivery dates with transparent milestone updates.",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Fit",
    desc: "Complimentary fine-tuning fittings until your garment sits with absolute perfection.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-transparent">
      {/* Hero Section */}
      <section className="relative min-h-[460px] md:min-h-[520px] mx-2 md:mx-6 lg:mx-8 mt-3 rounded-2xl flex items-center overflow-hidden shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Needlon Atelier Services"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/30" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-medium tracking-widest uppercase">
                Needlon Atelier
              </span>
            </div>

            <h1 className="text-white mb-5 text-4xl sm:text-5xl md:text-6xl font-garamond font-normal leading-tight tracking-tight">
              Bespoke Tailoring & Couture Services
            </h1>

            <p className="text-stone-200 text-sm md:text-base lg:text-lg mb-8 leading-relaxed font-light max-w-xl">
              From full-canvas power suits to intricate bridal adjustments and everyday refinements, our master artisans ensure every garment feels like a natural extension of yourself.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#services-grid"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c29f2f] text-black text-xs md:text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-102"
              >
                <span>View All Services</span>
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

      {/* Philosophy Statement */}
      <VibeStatement quote="True style isn't about standing out; it's about being remembered for the right reasons." />

      {/* Services Grid Section */}
      <section id="services-grid" className="py-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">
              Our Disciplines
            </span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>
          <h2 className="text-stone-900 dark:text-stone-100 text-3xl sm:text-4xl md:text-5xl font-garamond font-normal leading-tight">
            Tailoring for Every Moment
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base mt-3 leading-relaxed">
            Select a service to discover our design approach, measurement protocols, and artisan processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {servicesList.map((service, idx) => (
            <Link
              key={service.link}
              href={service.link}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 hover:border-[#D4AF37]/50 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              {/* Image Preview with aspect ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-xs text-white text-xs font-medium">
                  {service.badge}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs text-[#D4AF37] font-medium tracking-wider uppercase">
                    {service.tag}
                  </span>
                  <span className="text-xs font-garamond text-stone-300">
                    0{idx + 1}
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-stone-900 dark:text-stone-100 text-2xl font-garamond font-medium mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-medium tracking-wide uppercase mb-3">
                    {service.subtitle}
                  </p>
                  <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-200/70 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    View Process & Gallery
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 group-hover:bg-[#D4AF37] group-hover:text-black flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="py-20 px-4 md:px-8 lg:px-12 bg-[#FAF8F5] dark:bg-stone-900/30 border-y border-stone-200/60 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">
              The Needlon Promise
            </span>
            <h2 className="text-stone-900 dark:text-stone-100 mt-2 mb-4 text-3xl sm:text-4xl font-garamond font-normal leading-tight">
              Why Discerning Clients Choose Needlon
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-5 text-[#D4AF37]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-stone-900 dark:text-stone-100 font-garamond font-medium text-lg mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
