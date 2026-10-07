import { Ruler, Settings, Zap } from "lucide-react";
import React from "react";

const AlterationChooseUs = () => {
  return (
    <section className="bg-white dark:bg-white/1 py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-[#1A1D2E] dark:text-white mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 rounded-full mb-6">
              <Ruler className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3
              className="text-[#1A1D2E] dark:text-white/80 mb-3 text-xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Precision First
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We measure twice, cut once. Every alteration is executed with
              meticulous attention to detail and technical expertise.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 rounded-full mb-6">
              <Zap className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3
              className="text-[#1A1D2E] dark:text-white/80 mb-3 text-xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Quick Turnaround
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Standard alterations completed within 5-7 working days. Express
              service available for urgent needs.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 rounded-full mb-6">
              <Settings className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3
              className="text-[#1A1D2E] dark:text-white/80 mb-3 text-xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              All Garments Welcome
            </h3>
            <p className="text-gray-600 leading-relaxed">
              From high-street to haute couture, vintage to contemporary— we
              work with garments at every price point.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlterationChooseUs;
