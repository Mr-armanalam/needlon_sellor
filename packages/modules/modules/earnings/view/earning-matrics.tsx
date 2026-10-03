'use client';
import React from 'react';
import { Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { EarningsSummaryResponseDto } from '../dto/finance.dto';
import { useEarnings } from '../hooks/use-earnings';

interface EarningsMetricsProps {
  summary?: EarningsSummaryResponseDto | null;
  loading?: boolean;
  onWithdrawClick?: () => void;
}

export default function EarningsMetrics({
  summary: propSummary,
  loading: propLoading,
  onWithdrawClick,
}: EarningsMetricsProps) {
  const fallbackHook = useEarnings();
  const summary = propSummary !== undefined ? propSummary : fallbackHook.summary;
  const loading = propLoading !== undefined ? propLoading : fallbackHook.loading;

  const handleWithdraw = () => {
    if (onWithdrawClick) {
      onWithdrawClick();
    }
  };

  const availableBalance = summary
    ? `₹${parseFloat(summary.availablePayoutBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '₹0.00';

  const pendingBalance = summary
    ? `₹${parseFloat(summary.pendingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '₹0.00';

  const totalRevenue = summary
    ? `₹${parseFloat(summary.grossSales).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '₹0.00';

  const growthPercent = summary ? summary.monthOverMonthGrowth : 0;
  const isPositiveGrowth = summary ? summary.isGrowthPositive : true;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
      {/* Hero Card: Available Payout Funds */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{loading ? "..." : availableBalance}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <button 
          onClick={handleWithdraw}
          className="mt-4 w-full bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all text-center cursor-pointer"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Escrow Balance Tracking */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Balance</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{loading ? "..." : pendingBalance}</p>
          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> Payouts clear in 48 hours
          </p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Lifetime Sales Revenue */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{loading ? "..." : totalRevenue}</p>
          <p className={`text-[11px] flex items-center gap-0.5 font-medium mt-1 ${
            isPositiveGrowth ? 'text-green-600' : 'text-rose-600'
          }`}>
            {isPositiveGrowth ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`} vs last month
          </p>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}