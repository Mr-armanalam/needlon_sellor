import React from "react";
import {
  BadgePercent,
  Calendar,
  MapPin,
  Wallet,
  Languages,
  Truck,
} from "lucide-react";

const featuresData = [
  {
    id: 1,
    icon: BadgePercent,
    title: "No Commission",
    description:
      "Keep all your profits. We don't take a single cut from your hard-earned sales.",
    isFeatured: true, // Make this card stand out visually
    badge: "Most Loved",
  },
  {
    id: 2,
    icon: Calendar,
    title: "40-Day Free Trial",
    description:
      "Start completely risk-free. Test all premium tools without paying a dime upfront.",
    isFeatured: true,
    badge: "Risk-Free",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Local Customers",
    description:
      "Sell to buyers right in your neighborhood without worrying about complex delivery arrangements or extra costs.",
  },
  {
    id: 4,
    icon: Wallet,
    title: "Direct Payment",
    description:
      "Zero middleman delays. Your money goes instantly and directly into your preferred bank account or UPI.",
  },
  {
    id: 5,
    icon: Languages,
    title: "Hindi & English Support",
    description:
      "Language is no longer a barrier. Switch effortlessly to your native language for a simple, stress-free setup.",
  },
  {
    id: 6,
    icon: Truck,
    title: "Optional Delivery Partner",
    description:
      "Ready to scale up? Tap into our integrated logistics partners whenever you are ready to expand past your locality.",
  },
];

export default function WhySellersLoveUs() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto bg-slate-50/40 rounded-3xl my-16 border border-slate-100">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-serif">
          Why Sellers Love Us
        </h2>
        <p className="text-slate-500 mt-4 text-base md:text-lg">
          Everything you need to break free from high marketplace cuts and build
          a sustainable business from home.
        </p>
      </div>

      {/* Bento-Style Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`relative rounded-2xl p-8 border transition-all duration-300 group flex flex-col justify-between
                ${
                  feature.isFeatured
                    ? "bg-linear-to-br from-slate-900 to-indigo-950 text-white border-slate-800 md:col-span-1 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.3)]"
                    : "bg-white text-slate-800 border-slate-100 hover:border-slate-200/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                }`}
            >
              {/* Top Row: Icon and Optional Highlight Badge */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-xl border transition-colors duration-300
                    ${
                      feature.isFeatured
                        ? "bg-white/10 border-white/10 text-indigo-300 group-hover:bg-white/15"
                        : "bg-slate-50 border-slate-100/80 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100"
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.75} />
                  </div>

                  {feature.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                      {feature.badge}
                    </span>
                  )}
                </div>

                {/* Card Title */}
                <h3
                  className={`text-lg font-bold tracking-tight
                  ${feature.isFeatured ? "text-white" : "text-slate-900"}`}
                >
                  {feature.title}
                </h3>

                {/* Card Description */}
                <p
                  className={`mt-3 text-sm leading-relaxed font-medium
                  ${feature.isFeatured ? "text-slate-300" : "text-slate-500"}`}
                >
                  {feature.description}
                </p>
              </div>

              {/* Bottom Subtle Visual Anchor Line */}
              <div
                className={`h-1 w-8 rounded-full mt-6 transition-all duration-300 group-hover:w-16
                ${feature.isFeatured ? "bg-indigo-400" : "bg-slate-100 group-hover:bg-indigo-500"}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
