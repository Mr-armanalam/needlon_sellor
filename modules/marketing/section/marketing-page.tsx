'use client'

import CampaignPerformance from "../view/compaing-performance";
import MarketingToolkit from "../view/marketing-toolkit";

export default function MarketingPage() {
  return (
    /* Strictly sized layout boundaries to prevent full-frame scroll leaks */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-y-auto p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* Page Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Marketing & Store Growth</h1>
        <p className="text-xs text-gray-400 mt-0.5">Deploy coupon configurations, track campaigns, and distribute digital storefront links.</p>
      </div>

      {/* 1. Live Campaign Data Logs Container */}
      <CampaignPerformance />

      {/* 2. Modular Distribution Tools Layout */}
      <MarketingToolkit />

    </div>
  );
}