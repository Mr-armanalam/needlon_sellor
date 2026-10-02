'use client'

import DeliveryOverview from "../view/delivery-overview";
import DeliverySettingsTabs from "../view/delivery-setting-tab";

export default function DeliveryPage() {
  return (
    /* Strictly sized layout boundaries to prevent full-frame scroll leaks */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* Page Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Fulfillment & Delivery Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Link national shipping partners, configure local radius ranges, and map flat-rate fee tiers.</p>
      </div>

      {/* 1. Partner Status Grid Container */}
      <DeliveryOverview />

      {/* 2. Scroll-Isolated Configuration Tabs System Layout */}
      <DeliverySettingsTabs />

    </div>
  );
}