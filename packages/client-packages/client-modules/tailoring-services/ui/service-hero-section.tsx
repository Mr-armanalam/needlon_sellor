import Image from "next/image";
import React from "react";

interface Props {
  image: string;
  bespokeType: string;
  title: string;
  description: string;
}

const ServiceHeroSection = ({
  image,
  bespokeType,
  title,
  description,
}: Props) => {
  return (
    <section className="relative h-100 mx-2 md:mx-8 mt-4 rounded-sm flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          // src="https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHN1aXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc1NzQ3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          src={image}
          alt="Men's bespoke tailoring"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-[#1A1D2E]/90 via-[#1A1D2E]/70 to-[#1A1D2E]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-block mb-6 px-1 py-2 border-b border-[#D4AF37]">
            <span className="text-[#D4AF37] text-xs tracking-widest uppercase">
              {bespokeType} Bespoke
            </span>
          </div>

          <h1
            className="text-white mb-6 text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>

          <p className="text-gray-200 mb-10 leading-relaxed">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default ServiceHeroSection;
