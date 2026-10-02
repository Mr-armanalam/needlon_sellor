import { Lock } from "lucide-react";
import TrustItemCard from "../components/TrustItemCard";
import TrustHeader from "../components/trustHeader";

export default function TrustSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto mt-8">
      <div className="bg-slate-50 border border-slate-200/70 rounded-3xl p-8 md:p-12">
        <TrustHeader />
        <TrustItemCard />

        {/* Bottom Reassurance Stamp (Huge conversion booster in India) */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 text-center flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
          <Lock size={14} className="text-emerald-600 shrink-0" />
          <span>
            All merchant data and transactions are 256-bit SSL bank-grade
            encrypted.
          </span>
        </div>
      </div>
    </section>
  );
}
