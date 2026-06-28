import { Sparkles } from "lucide-react";
import PricingHeader from "../components/PricingHeader";
import PlanType from "../components/PlanType";
import FeaturesCheckList from "../components/FeaturesCheckList";
import PricingCTA from "../components/PricingCTA";

export default function PricingSection() {
  const premiumFeatures = [
    "Unlimited product listings",
    "Local selling with 0% commission",
    "Instant customer WhatsApp notifications",
    "Complete support in Hindi & Bengali",
    "Optional integrated delivery partner support",
  ];

  return (
    <section className="py-24 px-4 max-w-4xl mx-auto">
      <PricingHeader />

      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] overflow-hidden max-w-2xl mx-auto group">
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-center text-slate-200 text-sm font-medium tracking-wide flex items-center justify-center gap-2 border-b border-slate-800">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <span>
            Start completely free for your first 40 days • No credit card
            required
          </span>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:p-12 space-y-8">
          <PlanType />
          <FeaturesCheckList premiumFeatures={premiumFeatures} />
          <PricingCTA />
        </div>
      </div>
    </section>
  );
}
