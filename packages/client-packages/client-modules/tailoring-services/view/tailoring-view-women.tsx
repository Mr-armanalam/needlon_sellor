import ServiceHeroSection from "../ui/service-hero-section";
import VibeStatement from "../ui/vibe-statement";
import ServicePillarSection from "../ui/service-piller-section";
import { servicePillarsWomens, serviceStepWomens } from "@/data/service-data";
import ProcessSection from "../ui/process-section";
import ServiceImageGallery from "../ui/service-image-gallery";

export default function TailoringViewWomen() {
  return (
    <div className="min-h-screen dark:bg-transparent bg-white">
      <ServiceHeroSection
        bespokeType="Women's"
        title=" Precision Tailoring for the Modern Woman"
        image="https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwc3VpdHxlbnwxfHx8fDE3Njc2MzU0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        description=" From the boardroom to the gala, experience the confidence that comes from a garment designed specifically for your proportions."
      />

      <VibeStatement quote="We don't just fit clothes to your body; we craft them to match your ambition." />

      <ServicePillarSection
        heading="Our Collection"
        title="Key Service Pillars"
        servicePillars={servicePillarsWomens}
        description="Three distinctive collections designed to empower every aspect of your life. Versatile, sophisticated, and unmistakably yours."
      />

      <ProcessSection
        processStep={serviceStepWomens}
        title="Our Design Approach"
        subtitle=" A collaborative journey that celebrates your unique style and needs."
      />

      {/* Why Choose Us */}
      <section className="py-24 px-6 lg:px-8 dark:bg-white/3 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-[#1A1D2E] dark:text-white mb-4 text-4xl md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Designed for Your Life
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="mb-4">
                <div className="w-12 h-1 bg-[#D4AF37]" />
              </div>
              <h3
                className="text-[#1A1D2E] dark:text-white/80 mb-3 text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Versatility
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every piece is designed to integrate seamlessly into your
                existing wardrobe, offering endless styling possibilities for
                any occasion.
              </p>
            </div>

            <div>
              <div className="mb-4">
                <div className="w-12 h-1 bg-[#D4AF37]" />
              </div>
              <h3
                className="text-[#1A1D2E] dark:text-white/80 mb-3 text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Empowerment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Clothing should enhance your confidence, not constrain it. We
                create garments that move with you and support your ambitions.
              </p>
            </div>

            <div>
              <div className="mb-4">
                <div className="w-12 h-1 bg-[#D4AF37]" />
              </div>
              <h3
                className="text-[#1A1D2E] dark:text-white/80 mb-3 text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Craftsmanship
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From hidden pocket placements to reinforced seams, every detail
                is considered for both beauty and function.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ServiceImageGallery
        image1="https://images.unsplash.com/photo-1647202152259-98fe50ad0618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBkZXNpZ25lciUyMGZpdHRpbmd8ZW58MXx8fHwxNzY3NjU1OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image2="https://images.unsplash.com/photo-1723277171985-07c20f1876e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJsYXplciUyMHRhaWxvcmVkJTIwZmFzaGlvbnxlbnwxfHx8fDE3Njc2NTU5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        image3="https://images.unsplash.com/photo-1761117228880-df2425bd70da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwYmxvdXNlJTIwZWxlZ2FudCUyMGZhYnJpY3xlbnwxfHx8fDE3Njc2NTU5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />
    </div>
  );
}
