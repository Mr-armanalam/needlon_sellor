import React from 'react';
import { Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function EarningsMetrics({ onWithdrawClick }) {
  const accountStats = {
    availableBalance: "$12,450.80",
    pendingBalance: "$1,840.00",
    totalRevenue: "$48,920.00",
    revenueGrowth: "+14.2%"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
      {/* Hero Card: Available Payout Funds */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{accountStats.availableBalance}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <button 
          onClick={onWithdrawClick}
          className="mt-4 w-full bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all text-center"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Escrow Balance Tracking */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Balance</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{accountStats.pendingBalance}</p>
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
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{accountStats.totalRevenue}</p>
          <p className="text-[11px] text-green-600 flex items-center gap-0.5 font-medium mt-1">
            <ArrowUpRight className="w-3 h-3" /> {accountStats.revenueGrowth} vs last month
          </p>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}