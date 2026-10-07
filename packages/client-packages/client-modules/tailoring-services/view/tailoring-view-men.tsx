import ServiceHeroSection from "../ui/service-hero-section";
import VibeStatement from "../ui/vibe-statement";
import ServicePillarSection from "../ui/service-piller-section";
import ProcessSection from "../ui/process-section";
import ServiceImageGallery from "../ui/service-image-gallery";
import { servicePillarsMens, serviceStepMens } from "@/data/service-data";

export default function TailoringView() {
  return (
    <div className="min-h-screen bg-white dark:bg-transparent">
      <ServiceHeroSection
        bespokeType="Men's"
        title="The Modern Standard of Masculine Elegance"
        description=" Beyond the rack. We craft garments that respect tradition while embracing your individual style and physique."
        image="https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHN1aXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc1NzQ3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />
      <VibeStatement quote="True style isn't about standing out; it's about being remembered for the right reasons." />
      <ServicePillarSection
        servicePillars={servicePillarsMens}
        heading=" Our Craft"
        title="Key Service Pillars"
        description="Three foundational offerings that define masculine elegance. Each crafted with precision, built to endure."
      />
      <ProcessSection 
        title="The Bespoke Process"
        subtitle="From first consultation to final delivery, a journey of precision and care."
        processStep={serviceStepMens}
      />
      <ServiceImageGallery 
        image1="https://images.unsplash.com/photo-1633655442168-c6ef0ed2f984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWlsb3IlMjBtZWFzdXJpbmclMjBzdWl0fGVufDF8fHx8MTc2NzU3ODQyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image2="https://images.unsplash.com/photo-1588723722558-2210247e3a6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwc3VpdCUyMGRldGFpbHN8ZW58MXx8fHwxNzY3NTc4NDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image3="https://images.unsplash.com/photo-1603251605785-2a67176883ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzcyUyMHNoaXJ0JTIwZmFicmljJTIwdGV4dHVyZXxlbnwxfHx8fDE3Njc1Nzg0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />
    </div>
  );
}
