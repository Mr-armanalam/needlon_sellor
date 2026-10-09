import Image from "next/image";
import AboutContent from "./about-content";
import GetInTouch from "./ui/get-in-touch";

const AboutView = () => {
  return (
    <>
      <div className="grid my-10 dark:text-white/80 text-stone-700 grid-cols-2 px-24">
        <div className="relative mr-24 my-4">
          <Image src={"/images/image1.png"} fill alt="about image" />
        </div>
        <AboutContent />
      </div>
      <GetInTouch />
    </>
  );
};

export default AboutView;
