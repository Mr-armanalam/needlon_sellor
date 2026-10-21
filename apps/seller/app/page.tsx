import type { Metadata } from "next";

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
import { getPlatformStats } from "@/modules/home/services/platform-stats.service";
import NavbarView from "@/modules/Navbar/view/navbar-view";

export const metadata: Metadata = {
  title: "Sell on Needlon — Turn Your Clothing Business Into Income",
  description:
    "Sell clothes and bespoke tailoring in your locality with zero delivery charges, direct UPI payments and 100% of your earnings. Free for the first 40 days.",
  openGraph: {
    title: "Sell on Needlon",
    description:
      "The marketplace for local tailors, boutiques and clothing sellers. Keep 100% of your earnings.",
    type: "website",
  },
};

// Stats are refreshed hourly; the page itself is fully server-rendered.
export const revalidate = 3600;

const page = async () => {
  const stats = await getPlatformStats();

  return (
    <div className="pt-28 md:pt-9">
      <NavbarView />
      <HeroSection stats={stats} />
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
