import {
  BadgePercent,
  Calendar,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import React from "react";

const TrustBadgeRibbon = () => {
  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl px-6 py-4 flex flex-wrap justify-center lg:justify-between items-center gap-y-4 gap-x-8 text-xs font-semibold tracking-wide text-slate-300">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-emerald-500" />{" "}
        <span>Verified Sellers</span>
      </div>
      <div className="flex items-center gap-2">
        <BadgePercent size={16} className="text-emerald-500" />{" "}
        <span>No Sales Commission</span>
      </div>
      <div className="flex items-center gap-2">
        <Smartphone size={16} className="text-emerald-500" />{" "}
        <span>Direct UPI Payments</span>
      </div>
      <div className="flex items-center gap-2">
        <Truck size={16} className="text-emerald-500" />{" "}
        <span>Optional Delivery Support</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-emerald-500" />{" "}
        <span>40-Day Risk-Free Trial</span>
      </div>
    </div>
  );
};

export default TrustBadgeRibbon;
