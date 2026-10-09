import React from "react";
import ServiceHeroSection from "../ui/service-hero-section";
import VibeStatement from "../ui/vibe-statement";
import ServicePillarSection from "../ui/service-piller-section";
import { alterationStep, servicePillarsAlteration } from "@/data/service-data";
import CommonAlteration from "../ui/common-alteration";
import ProcessSection from "../ui/process-section";
import ServiceImageGallery from "../ui/service-image-gallery";
import AlterationChooseUs from "../ui/altration-choose-us";

const AlterationView = () => {
  return (
    <>
      <ServiceHeroSection
        title="The Art of the Perfect Fit"
        description="Don't let a poor fit hide a great garment. We breathe new life into your wardrobe with master-level alterations and structural refinements."
        bespokeType="Fitting & Alterations"
        image="https://images.unsplash.com/photo-1719563014656-802c0aa9632a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWlsb3IlMjBtZWFzdXJpbmclMjBjbG90aGVzJTIwYWx0ZXJhdGlvbnN8ZW58MXx8fHwxNzY3ODMwNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />

      <VibeStatement quote="We believe the difference between a good outfit and a great one is exactly 1/4 of an inch." />

      <ServicePillarSection
        servicePillars={servicePillarsAlteration}
        heading="What We Do"
        title="Alteration Services"
        description="From minor adjustments to major overhauls, we deliver precision alterations that transform how your clothes look and feel."
      />

      <CommonAlteration />

      <ProcessSection
        title="How It Works"
        subtitle="A simple, efficient process designed to get you back in your favorite clothes quickly."
        processStep={alterationStep}
        bg="bg-[#F5F3EF]"
      />

      <AlterationChooseUs />

      <ServiceImageGallery
        image1="https://images.unsplash.com/photo-1634626857321-deb416dcdb00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZW1taW5nJTIwdHJvdXNlcnMlMjB0YWlsb3Jpbmd8ZW58MXx8fHwxNzY3ODMwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image2="https://images.unsplash.com/photo-1591380816222-28cec94b49c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGFsdGVyYXRpb25zJTIwc2V3aW5nfGVufDF8fHx8MTc2NzgzMDYwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image3="https://images.unsplash.com/photo-1522578755536-1e6830124399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWlsb3IlMjB3b3Jrc3BhY2UlMjB0b29sc3xlbnwxfHx8fDE3Njc4MzA2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />
    </>
  );
};

export default AlterationView;
