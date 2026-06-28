import CTABlock from "../components/CTABlock";
import TrustBadgeRibbon from "../ui/trust-badge-rebbon-row";
import LegalAndCopyrightBase from "../ui/legal-copyright-base";
import FooterGridCard from "../ui/footer-grid-card";

export default function MasterFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-8 px-4 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <CTABlock />
        <FooterGridCard />
        <TrustBadgeRibbon />
        <LegalAndCopyrightBase />
      </div>
    </footer>
  );
}
