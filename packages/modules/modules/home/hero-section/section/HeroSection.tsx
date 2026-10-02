import Image from "next/image";
import HeroTagline from "../components/hero-tagline";

const HeroSection = () => {
  return (
    <div className="h-screen bg-gray-100">
      <div className="flex w-full h-full">
        <HeroTagline />
        <div className="relative w-full">
          <Image
            src={"/hero_img/wout_men.png"}
            className="w-full"
            alt="heroImage"
            fill
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
