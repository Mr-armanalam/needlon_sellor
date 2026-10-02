'use client'

import EarningsMetrics from "../view/earning-matrics";
import IncomeAnalytics from "../view/income-analytics";
import LedgerHistory from "../view/lodger-history";


export default function EarningsPage() {
  const handleWithdrawalRequest = () => {
    alert('Processing batch settlement payout to your linked bank account transfer route.');
  };

  return (
    /* Strictly sized to fit layout view boundaries perfectly */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6">
      
      {/* 1. Header Information */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Earnings & Payout Ledger</h1>
        <p className="text-xs text-gray-400 mt-0.5">Monitor lifetime income, configure weekly transfers, and download tax statements.</p>
      </div>

      {/* 2. Top-Level Core Metric Highlight Badges */}
      <EarningsMetrics onWithdrawClick={handleWithdrawalRequest} />

      {/* 3. Mid-Level Performance Graph Frameworks */}
      <IncomeAnalytics />

      {/* 4. Bottom Ledger Data Tables (Scroll-isolated) */}
      <LedgerHistory />

    </div>
  );
}