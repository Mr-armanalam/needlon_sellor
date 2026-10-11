import Image from "next/image";
import React from "react";

const ServiceImageGallery = ({
  image1,
  image2,
  image3,
}: {
  image1: string;
  image2: string;
  image3: string;
}) => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-white dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">The Atelier</span>
          <h3 className="text-stone-900 dark:text-stone-100 text-2xl sm:text-3xl font-garamond font-normal mt-2">
            Artisanal Precision in Every Stitch
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Large Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-stone-200/80 dark:border-stone-800 shadow-sm group">
            <Image
              src={image1}
              alt="Tailor measuring and crafting"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Right Two Stacked Images */}
          <div className="grid grid-cols-1 gap-6">
            <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-stone-200/80 dark:border-stone-800 shadow-sm group">
              <Image
                src={image2}
                alt="Suit and tailoring details"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-stone-200/80 dark:border-stone-800 shadow-sm group">
              <Image
                src={image3}
                alt="Fabric weaves and textures"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceImageGallery;
