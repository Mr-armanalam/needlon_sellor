'use client';

import React, { useState } from 'react';
import { X, Wallet, Building2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  bankAccounts: any[];
  onRequestPayout: (amount: number, bankAccountId?: string) => Promise<{ success: boolean; error?: string; data?: any }>;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  bankAccounts,
  onRequestPayout,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [selectedBankId, setSelectedBankId] = useState<string>(
    bankAccounts[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount || '0');
  const isAmountValid = numAmount >= 100 && numAmount <= availableBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numAmount < 100) {
      setError('Minimum withdrawal amount is ₹100.00');
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Amount cannot exceed available balance of ₹${availableBalance.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);
    const res = await onRequestPayout(numAmount, selectedBankId || undefined);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessInfo(
        `Withdrawal of ₹${numAmount.toFixed(2)} initiated successfully! Reference: ${res.data?.requestId || 'SET-PENDING'}`
      );
      setTimeout(() => {
        setSuccessInfo(null);
        setAmount('');
        onClose();
      }, 2000);
    } else {
      setError(res.error || 'Failed to process withdrawal request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Withdraw Funds</h3>
              <p className="text-xs text-gray-400">Transfer available earnings to bank</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Available balance highlight */}
          <div className="bg-slate-50 border border-gray-100 rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Available for Payout</span>
            <span className="text-base font-bold text-gray-900">
              ₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Success banner */}
          {successInfo && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Withdrawal Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="100"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                disabled={isSubmitting || availableBalance <= 0}
                className="w-full pl-8 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
              <span>Minimum: ₹100.00</span>
              {availableBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance.toString())}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Withdraw All
                </button>
              )}
            </div>
          </div>

          {/* Destination bank account */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Destination Account</label>
            {bankAccounts.length > 0 ? (
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-gray-700 cursor-pointer"
              >
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} (•••• {acc.accountNumberLast4 || acc.accountNumber?.slice(-4) || 'Bank'}) {acc.isPrimary ? '• Primary' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-xs text-amber-700">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span>Primary Bank Transfer (Settlement Account x-4921)</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAmountValid || availableBalance <= 0}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl transition-all shadow-sm shadow-blue-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm Withdrawal</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
