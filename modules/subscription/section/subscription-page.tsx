'use client'

import BillingLedger from "../view/belling-ladger";
import SubscriptionHero from "../view/subscription-hero";


export default function SubscriptionPage() {
  return (
    /* Strictly sized layout boundaries to prevent full-frame scroll leaks */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* Page Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Subscription & Billing</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your service plan settings, review your upcoming payment cycle, and look over historical accounting tax records.</p>
      </div>

      {/* 1. Subscription Metrics & Plan Benefits Grid */}
      <SubscriptionHero />

      {/* 2. Scroll-Isolated Billing History Ledger Framework */}
      <BillingLedger />

    </div>
  );
}