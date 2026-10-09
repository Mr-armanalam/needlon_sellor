import React from "react";
import ServiceHeroSection from "../ui/service-hero-section";
import VibeStatement from "../ui/vibe-statement";
import ServicePillarSection from "../ui/service-piller-section";
import ProcessSection from "../ui/process-section";
import ServiceImageGallery from "../ui/service-image-gallery";
import { servicePillarsWedding, whyChooseUsWedding } from "@/data/service-data";
import WeddingTimeline from "../components/wedding-timeline";

const TailoringViewWeddingOccation = () => {
  return (
    <div className="min-h-screen dark:bg-transparent bg-white">
      <ServiceHeroSection
        image="https://images.unsplash.com/photo-1655490162630-175929877280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY3NjE1NzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        bespokeType="Wedding & Occasionwear"
        title=" Elegance Tailored to Your Greatest Moments"
        description="From bespoke groom's suits to exquisite bridal adjustments, we ensure you walk down the aisle in a garment that feels like a second skin."
      />

      <VibeStatement quote="A wedding is a once-in-a-lifetime event. Your clothes shouldn't just fit; they should tell your story." />
      <ServicePillarSection
        servicePillars={servicePillarsWedding}
        heading="Our Services"
        title="Wedding Tailoring Services"
        description="Comprehensive tailoring solutions for every member of your celebration, ensuring perfect fit and timeless elegance."
      />

      <WeddingTimeline />
      <ProcessSection 
        title="Why Couples Choose Us"
        processStep={whyChooseUsWedding}
      />
      <ServiceImageGallery
        image1="https://images.unsplash.com/photo-1764925418771-083de635351a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9vbSUyMHdlZGRpbmclMjBzdWl0JTIwZWxlZ2FudHxlbnwxfHx8fDE3Njc2NTY0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image2="https://images.unsplash.com/photo-1766104797322-3826d7158c64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZSUyMHdlZGRpbmclMjBkcmVzcyUyMGZpdHRpbmd8ZW58MXx8fHwxNzY3NjU2NDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image3="https://images.unsplash.com/photo-1529635229076-82fefed713c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwc3VpdCUyMHRocmVlJTIwcGllY2V8ZW58MXx8fHwxNzY3NjU2NDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        />
    </div>
  );
};

export default TailoringViewWeddingOccation;
