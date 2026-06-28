import CTABlock from "../components/CTABlock";
import BrandStory from "../components/BrandStory";
import QuickLink from "../components/QuickLink";
import Support from "../components/Support";
import Languages from "../components/Languages";
import SellerResources from "../components/SellerResources";
import SocialMedia from "../components/SocialMedia";
import TrustBadgeRibbon from "../ui/trust-badge-rebbon-row";
import LegalAndCopyrightBase from "../ui/legal-copyright-base";

export default function MasterFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-8 px-4 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <CTABlock />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 pb-12 border-b border-slate-900">
          <BrandStory />
          <QuickLink />
          <Support />
          <Languages />
          <SellerResources />
          <SocialMedia />
        </div>
        <TrustBadgeRibbon />
        <LegalAndCopyrightBase />
      </div>
    </footer>
  );
}
