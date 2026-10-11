'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Ruler, Banknote, FileText, Loader2 } from 'lucide-react';

interface CreateInStoreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  measurements: Array<{ id: string; garmentType: string; unit: string; date: string }>;
  onOrderCreated: () => void;
}

export default function CreateInStoreOrderModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  measurements,
  onOrderCreated,
}: CreateInStoreOrderModalProps) {
  const [garmentName, setGarmentName] = useState('');
  const [measurementId, setMeasurementId] = useState(measurements[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [tailoringStage, setTailoringStage] = useState('ORDER_PLACED');
  const [tailoringNotes, setTailoringNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING' | 'PARTIAL'>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'COD'>('CASH');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!garmentName.trim()) {
      setError('Please enter garment name / commission title');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid price amount');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/seller/orders/in-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          measurementId: measurementId || null,
          garmentName: garmentName.trim(),
          amount: parsedAmount,
          tailoringStage,
          tailoringNotes: tailoringNotes.trim() || null,
          paymentStatus,
          paymentMethod,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to create order');
      }

      onOrderCreated();
      onClose();
      // Reset
      setGarmentName('');
      setAmount('');
      setTailoringNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to create in-store order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Create In-Store Bespoke Order</h3>
              <p className="text-xs text-gray-500">Attach commission to {customerName}&apos;s account</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Garment / Commission Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Bespoke Italian Wool 2-Piece Suit"
              value={garmentName}
              onChange={(e) => setGarmentName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link Measurement Profile
              </label>
              <div className="relative">
                <select
                  value={measurementId}
                  onChange={(e) => setMeasurementId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 truncate"
                >
                  <option value="">No profile / Standard</option>
                  {measurements.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.garmentType.toUpperCase()} ({m.unit}) - {m.date}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Total Price (₹) *
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="100"
                  placeholder="e.g. 8500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Initial Tailoring Milestone
              </label>
              <select
                value={tailoringStage}
                onChange={(e) => setTailoringStage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ORDER_PLACED">Order Placed</option>
                <option value="MEASUREMENT_VERIFIED">Measurement Verified</option>
                <option value="PATTERN_DRAFTING">Pattern Drafting</option>
                <option value="IN_CUTTING">In Cutting</option>
                <option value="TRIAL_FITTING">Trial / Fitting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="PAID">Paid in Full</option>
                <option value="PARTIAL">Advance Deposit (Partial)</option>
                <option value="PENDING">Payment Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="flex gap-2">
              {(['CASH', 'UPI', 'CARD'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Fabric Specifications & Cutting Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <textarea
                rows={2}
                placeholder="e.g. Client provided self-fabric; 1st trial fitting scheduled for Thursday."
                value={tailoringNotes}
                onChange={(e) => setTailoringNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Creating Order...' : 'Create In-Store Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
