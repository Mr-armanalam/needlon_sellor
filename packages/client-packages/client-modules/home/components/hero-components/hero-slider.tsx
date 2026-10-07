/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/*

  > Implemented shadcn Carousel, with looped swap, autoplay, delay 4sec
  > Showcasing Product Images, name, description, offer

*/

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LucideTag } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { heroProps } from "@/app/(root)/(home)/@hero_section/page";
import { useRouter } from "next/navigation";


const HeroSlider = ({tailoringServices}:{tailoringServices: heroProps[]}) => {
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<any>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex cursor-pointer flex-col items-center">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
          dragFree: false, // smooth snap after swipe
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false, // autoplay continues after swipe
          }),
        ]}
        className="min-w-[95vw] bg-linear-to-r from-stone-950 to-stone-800 dark:border dark:from-stone-950/30 dark:to-stone-800/30 rounded-sm flex relative h-fit xl:h-100 mt-10 max-w-xs"
      >
        <CarouselContent>
          {tailoringServices.map((item, index) => (
            <CarouselItem className="flex justify-center xl:pr-1" key={index}>
              <Card className="xl:w-[90vw] max-sm:w-full rounded-none shadow-none border-none bg-gray-90">
                <CardContent onClick={() => router.push(`/product/${item.id}`)} className=" flex xl:gap-x-36 gap-x-4 aspect-auto text-white w-full items-center xl:px-28 xl:py-6">
                  <div className="flex-1">
                    <h1 className="text-6xl max-sm:text-xl font-garamond">{item.name}</h1>
                    <p className="text-sm mt-4 xl:mt-8 xl:pl-3 max-sm:text-[10px] text-white/70">
                      {item.description}
                    </p>
                    <div className="xl:mt-8 max-sm:hidden flex items-center ml-3 px-4 text-xs text-black font-bold rounded-sm xl:py-2.5 w-fit bg-stone-200">
                      <LucideTag size={16} className="mr-1.5 text-red-700 " />
                      {item?.offer ?? "no offer"}
                    </div>
                  </div>
                  <div className="xl:w-75 max-sm:w-30 rounded-t-full rounded-b-3xl xl:h-75 max-sm:h-40 flex justify-center relative text-white">
                    <Image
                      className="z-50 absolute"
                      fill
                      src={item.image}
                      alt="offer item"
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute max-sm:hidden border-none rounded-l-none text-gray-950 bg-zinc-100 rounded-r-sm h-25 left-0 dark:text-white dark:border cursor-pointer" />
        <CarouselNext className="absolute max-sm:hidden border-none rounded-r-none text-gray-950 rounded-l-sm bg-zinc-100 h-25 right-0 dark:text-white dark:border cursor-pointer" />
      </Carousel>

      {/* Dots indicator */}
      <div className="flex mt-4 gap-2">
        {tailoringServices.map((_, idx) => (
          <div
            key={idx}
            className={`w-4 h-1 rounded-full transition-all duration-500 ${
              current === idx
                ? "bg-gray-900 scale-100 scale-x-180 mx-1.5"
                : "bg-gray-400 scale-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
