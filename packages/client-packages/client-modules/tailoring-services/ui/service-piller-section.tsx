import React from "react";
import { ServicePillar } from "../components/service-piller";
import { servicePillarsMens } from "@/data/service-data";

type Props = {
  servicePillars: typeof servicePillarsMens;
  heading: string;
  title: string;
  description: string;
};

const ServicePillarSection = ({
  servicePillars,
  heading,
  title,
  description,
}: Props) => {
  return (
    <section id="pillars" className="py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] tracking-widest uppercase text-xs md:text-sm font-medium">
              {heading}
            </span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>

          <h2 className="text-stone-900 dark:text-stone-100 mb-4 text-3xl sm:text-4xl md:text-5xl font-garamond font-normal leading-tight">
            {title}
          </h2>

          <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {servicePillars.map((pillar, index) => (
            <ServicePillar
              key={pillar.title}
              title={pillar.title}
              description={pillar.description}
              imageUrl={pillar.imageUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicePillarSection;