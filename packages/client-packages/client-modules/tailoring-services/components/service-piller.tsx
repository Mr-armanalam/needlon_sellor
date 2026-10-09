import Image from "next/image";
import React from "react";

interface ServicePillarProps {
  title: string;
  description: string;
  imageUrl: string;
  index: number;
}

export function ServicePillar({
  title,
  description,
  imageUrl,
  index,
}: ServicePillarProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center`}
    >
      {/* Image */}
      <div className={`${!isEven ? "lg:order-2" : ""}`}>
        <div className="relative aspect-4/5 overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className={`${!isEven ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-4 mb-4">
          <span
            className="text-[#D4AF37] text-6xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="h-px flex-1 bg-[#D4AF37]" />
        </div>

        <h3
          className="text-[#1A1D2E] dark:text-white mb-4 text-3xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>

        <p className="text-gray-600 text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
