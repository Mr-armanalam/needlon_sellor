import { serviceStepMens } from "@/data/service-data";
import React from "react";

const ProcessSection = ({
  title,
  subtitle,
  processStep,
  bg
}: {
  title: string;
  subtitle?: string;
  processStep: typeof serviceStepMens;
  bg?: string;
}) => {
  return (
    <section id="process" className={`${bg ?? 'bg-white'} dark:bg-white/2 py-24 px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-[#1A1D2E] dark:text-white mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processStep?.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                <span
                  className="text-[#D4AF37] text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.step}
                </span>
              </div>
              <h4
                className="text-[#1A1D2E] dark:text-white/60 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.name}
              </h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
