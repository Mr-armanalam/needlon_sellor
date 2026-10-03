'use client';

import React, { useState } from "react";
import EarningsMetrics from "../view/earning-matrics";
import IncomeAnalytics from "../view/income-analytics";
import LedgerHistory from "../view/lodger-history";
import WithdrawalModal from "../components/withdrawal-modal";
import { useEarnings } from "../hooks/use-earnings";

export default function EarningsPage() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const earnings = useEarnings();

  const handleWithdrawalRequest = () => {
    setIsWithdrawModalOpen(true);
  };

  const availableBalanceNum = earnings.summary
    ? parseFloat(earnings.summary.availablePayoutBalance)
    : 0;

  return (
    /* Strictly sized to fit layout view boundaries perfectly */
    <div className="flex flex-1 h-[calc(100vh-64px) h-auto w-full overflow-hidde p-6 bg-slate-50 flex-col space-y-6">
      
      {/* 1. Header Information */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Earnings & Payout Ledger</h1>
        <p className="text-xs text-gray-400 mt-0.5">Monitor lifetime income, configure weekly transfers, and download tax statements.</p>
      </div>

      {/* 2. Top-Level Core Metric Highlight Badges */}
      <EarningsMetrics
        summary={earnings.summary}
        loading={earnings.loading}
        onWithdrawClick={handleWithdrawalRequest}
      />

      {/* 3. Mid-Level Performance Graph Frameworks */}
      <IncomeAnalytics
        analytics={earnings.analytics}
        timeframe={earnings.timeframe}
        loading={earnings.analyticsLoading}
        onTimeframeChange={earnings.setTimeframe}
      />

      {/* 4. Bottom Ledger Data Tables (Scroll-isolated) */}
      <LedgerHistory
        ledger={earnings.ledger}
        viewType={earnings.viewType}
        loading={earnings.ledgerLoading}
        onViewTypeChange={earnings.setViewType}
        onExportCsv={earnings.exportCsv}
      />

      {/* 5. Dynamic Withdrawal Modal Dialog */}
      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={availableBalanceNum}
        bankAccounts={earnings.bankAccounts}
        onRequestPayout={earnings.requestPayout}
      />

    </div>
  );
}