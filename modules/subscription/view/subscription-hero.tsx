import React from 'react';
import { Sparkles, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SubscriptionHero() {
  const subData = {
    planName: "Seller Pro Growth",
    cost: "$49/month",
    status: "Active Trial",
    trialDaysLeft: 8,
    renewalDate: "July 7, 2026",
    benefits: [
      "Unlimited product listings & inventory tracking",
      "Advanced industrial AI image & configuration inspection modules",
      "Integrated multi-channel WhatsApp customer communication tools",
      "0% platform transaction fees on international shipping zones"
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
      {/* Active Plan Matrix */}
      <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30">
              {subData.status}
            </span>
            <h2 className="text-xl font-bold tracking-tight pt-2">{subData.planName}</h2>
            <p className="text-2xl font-black text-white mt-1">{subData.cost}</p>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-center self-start sm:self-auto">
            Upgrade Tier Plan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-700/50 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Trial Period Ends In: <strong className="text-white font-semibold">{subData.trialDaysLeft} Days</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Next Automatic Renewal: <strong className="text-white font-semibold">{subData.renewalDate}</strong></span>
          </div>
        </div>
      </div>

      {/* Account Inclusions Benefits Sheet */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Included Core Benefits</h3>
          <ul className="space-y-2.5">
            {subData.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}