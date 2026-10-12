'use client';


import { apiFetch } from "@/modules/auth/lib/auth-client";
import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';

interface OrderHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: string;
  paymentStatus: string;
  onHandoverCompleted: () => void;
}

export default function OrderHandoverModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  customerName,
  totalAmount,
  paymentStatus,
  onHandoverCompleted,
}: OrderHandoverModalProps) {
  const [handoverNotes, setHandoverNotes] = useState('Garment inspected, tried on, and handed over to client in store.');
  const [markPaid, setMarkPaid] = useState(paymentStatus !== 'PAID');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/seller/orders/${orderId}/handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handoverNotes: handoverNotes.trim() || undefined,
          markPaid,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to record in-store handover');
      }

      onHandoverCompleted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error recording handover');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">In-Store Garment Handover</h3>
              <p className="text-xs text-gray-500">
                Order <span className="font-semibold text-gray-700">{orderNumber}</span> • {customerName}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Total Order Value:</span>
              <span className="font-bold text-stone-900">{totalAmount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Current Payment Status:</span>
              <span className={`font-semibold px-2 py-0.5 rounded ${paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                {paymentStatus}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Handover Remarks & Verification Notes
            </label>
            <textarea
              rows={3}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {paymentStatus !== 'PAID' && (
            <label className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={markPaid}
                onChange={(e) => setMarkPaid(e.target.checked)}
                className="rounded border-amber-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-amber-900 font-medium">
                Collect remaining balance and mark order as <strong>PAID</strong>
              </span>
            </label>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Completing Handover...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Handover & Complete Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
