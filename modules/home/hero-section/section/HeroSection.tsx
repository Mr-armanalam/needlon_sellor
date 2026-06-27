import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="h-screen bg-gray-100">
      <div className="flex w-full h-full">
        <div className="flex flex-col w-3/5 pl-14 justify-center items-start">
          <h1 className="text-5xl">
            <span className="text-6xl">Turn Your Clothing</span>{" "}
            <span className="pl-2">Business Into Income</span>
          </h1>
          <p className="pl-2 mt-8 text-xl">
            Sell clothes in your locality without delivery charges.
          </p>
          <ul className="pl-2 text-stone-600">
            <li>✔ Sell from home</li>
            <li>✔ Keep 100% of your earnings</li>
            <li>✔ Hindi & Bengali support </li>
            <li> ✔ Free for first 40 days</li>
          </ul>
         
        </div>
        <div className="relative w-full">
          <Image
            src={"/hero_img/wout_men.png"}
            className="w-full"
            alt="heroImage"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
