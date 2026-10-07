"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductCardProps {
  image: string;
  title: string;
  offer: string;
}

export default function ProductCard({ image, title, offer }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {

      gsap.fromTo(
        imageRef.current,
        { 
          y: -100, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)", 
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%", // Triggers when top of card hits 85% of viewport
            toggleActions: "play none none none", 
          },
        }
      );
    },
    { scope: cardRef }
  );

  return (
    <div 
      ref={cardRef} 
      className="bg-white flex flex-col items-center justify-center p-4 transition-shadow hover:shadow-md rounded-lg overflow-hidden"
    >
      <div 
        ref={imageRef} 
        className="relative w-55 h-55 will-change-transform"
      >
        <Image 
          src={image || "/placeholder-image.png"} 
          alt={title} 
          fill 
          sizes="220px"
          className="object-contain"
          priority={false} // Only set to true for above-the-fold items
        />
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-slate-800 line-clamp-1">{title}</p>
        <p className="text-md font-bold text-blue-600">{offer}</p>
      </div>
    </div>
  );
}

