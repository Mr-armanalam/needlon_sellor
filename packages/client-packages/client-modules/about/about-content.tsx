"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const AboutContent = () => {
  const router = useRouter();
  return (
    <div className="pt-20">
      <h1 className="font-garamond text-6xl font-semibold">
        The Visioniary <br /> Behind The Needlon{" "}
      </h1>
      <div className="flex font-garamond flex-col gap-y-8 mt-12 ">
        <p>
          In an era of mass production and fleeting trends, we stand as a
          sanctuary for those who value the permanence of style. We don't just
          sew fabric; we engineer confidence. By merging the time-honored
          traditions of bespoke tailoring with a modern, digital-first approach,
          Needlon ensures that the heritage of the master tailor is accessible
          to the contemporary individual, anywhere in the world.
        </p>

        <p>
          Needlon bridges the gap between the physical atelier and the digital
          doorstep. Through our intuitive online platform, we’ve distilled the
          complex world of tailoring into a seamless experience. Whether you are
          ordering a ready-to-wear essential or utilizing our advanced
          measurement profiles for a custom piece.
        </p>

        <p>
          We believe that clothing is an investment in one’s self. Our
          commitment extends beyond the aesthetic. We prioritize ethical
          sourcing and sustainable practices to ensure that the luxury you wear
          today does not compromise the world of tomorrow. At Needlon, we aren't
          just building a brand, we are cultivating a community of individuals
          who understand that true style is silent, quality is paramount, and
          the perfect fit is non-negotiable.
        </p>
      </div>
      <div className="flex justify-between items-center  mb-4">
        <Button
          variant={"outline"}
          onClick={() => router.push("/new-in/arrivals")}
          className="cursor-pointer border-yellow-600 text-stone-700 dark:text-white hover:bg-yellow-600 transition-colors delay-200 hover:text-white"
        >
          Explore our work
        </Button>
        <div className="text-yellow-600 relative w-40 aspect-3/2">
          <Image src={"/images/arman_new_signature.png"} alt="signature" fill />
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
