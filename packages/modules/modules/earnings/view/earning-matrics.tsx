'use client';
import React from 'react';
import { Wallet, Clock, ArrowUpRight } from 'lucide-react';
import { useEarnings } from '@/modules/earnings/hooks/use-earnings';

export default function EarningsMetrics({ onWithdrawClick }: { onWithdrawClick?: () => void }) {
  const { summary, loading, requestPayout } = useEarnings();

  const handleWithdraw = async () => {
    if (onWithdrawClick) onWithdrawClick();
    else {
      const amountStr = prompt("Enter withdrawal amount in ₹:");
      if (!amountStr) return;
      const amount = parseFloat(amountStr);
      if (isNaN(amount)) return alert("Invalid amount entered");
      const res = await requestPayout(amount);
      if (res.success) alert(`Payout request submitted successfully! ID: ${res.data?.requestId}`);
      else alert(res.error || "Payout request failed");
    }
  };

  const availableBalance = summary ? `₹${summary.availablePayoutBalance}` : "₹0.00";
  const pendingBalance = summary ? `₹${summary.pendingBalance}` : "₹0.00";
  const totalRevenue = summary ? `₹${summary.grossSales}` : "₹0.00";

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
          <p className="text-[11px] text-green-600 flex items-center gap-0.5 font-medium mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs last month
          </p>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}