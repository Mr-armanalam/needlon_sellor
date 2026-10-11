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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Image */}
      <div className={`${!isEven ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-stone-200/80 dark:border-stone-800 shadow-md group">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className={`${!isEven ? "lg:order-1" : ""} px-2 sm:px-4`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[#D4AF37] text-4xl sm:text-5xl md:text-6xl font-garamond font-light tracking-tighter">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-60" />
        </div>

        <h3 className="text-stone-900 dark:text-stone-100 mb-4 text-2xl sm:text-3xl md:text-4xl font-garamond font-normal leading-tight">
          {title}
        </h3>

        <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
