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
    <section className="py-24 px-6 lg:px-8 dark:bg-transparent bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Large Image */}
          <div className="relative aspect-3/4 overflow-hidden rounded-sm">
            <Image
              src={image1}
              alt="Tailor measuring"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Right Images */}
          <div className="grid grid-cols-1 gap-6">
            <div className="relative aspect-3/2 overflow-hidden rounded-sm">
              <Image
                src={image2}
                alt="Suit details"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="relative aspect-3/2 overflow-hidden rounded-sm">
              <Image
                src={image3}
                alt="Fabric textures"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceImageGallery;
