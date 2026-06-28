import MasterFooter from "@/modules/footer/section/FooterSection";
import EarningsCalculator from "@/modules/home/earning-calculator/section/EarnCalc";
import FAQSection from "@/modules/home/FAQ/section/FAQSection";
import FinalCTA from "@/modules/home/final-CTA/section/FinalCTA";
import HeroSection from "@/modules/home/hero-section/section/HeroSection";
import HowItWorksSection from "@/modules/home/how-it-work/section/HowItWorks";
import PricingSection from "@/modules/home/pricing/section/PricingSection";
import ProblemSolution from "@/modules/home/problem-solution/section/ProblemSolution";
import SuccessStories from "@/modules/home/success-story/section/SuccessStory";
import TrustSection from "@/modules/home/trust-section/section/TrustSection";
import WhySellersLoveUs from "@/modules/home/why-seller-love-us/section/WhyUs";
import NavbarView from "@/modules/Navbar/view/navbar-view";

const page = () => {
  return (
    <div className="pt-28 md:pt-9">
      <NavbarView />
      <HeroSection />
      <ProblemSolution />
      <HowItWorksSection />
      <WhySellersLoveUs />
      <EarningsCalculator />
      <SuccessStories />
      <PricingSection />
      <TrustSection />
      <FAQSection />
      <FinalCTA />
      <MasterFooter />
    </div>
  );
};

export default page;
