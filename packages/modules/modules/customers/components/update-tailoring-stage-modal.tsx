'use client';

import React, { useState } from 'react';
import { X, Scissors, Loader2 } from 'lucide-react';

const TAILORING_STAGES_LIST = [
  { value: 'ORDER_PLACED', label: '1. Order Placed' },
  { value: 'MEASUREMENT_VERIFIED', label: '2. Measurement Verified' },
  { value: 'PATTERN_DRAFTING', label: '3. Pattern Drafting' },
  { value: 'IN_CUTTING', label: '4. In Cutting' },
  { value: 'TRIAL_FITTING', label: '5. Trial / Baste Fitting' },
  { value: 'FINAL_STITCH', label: '6. Hand Stitching & Assembly' },
  { value: 'QUALITY_INSPECTION', label: '7. Quality Inspection' },
  { value: 'READY_FOR_PICKUP', label: '8. Ready for Pickup' },
  { value: 'COMPLETED', label: '9. Completed & Handed Over' },
];

interface UpdateTailoringStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  currentStage?: string | null;
  currentNotes?: string | null;
  onStageUpdated: () => void;
}

export default function UpdateTailoringStageModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  currentStage,
  currentNotes,
  onStageUpdated,
}: UpdateTailoringStageModalProps) {
  const [stage, setStage] = useState(currentStage || 'ORDER_PLACED');
  const [notes, setNotes] = useState(currentNotes || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/seller/orders/${orderId}/tailoring-stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          notes: notes.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update tailoring stage');
      }

      onStageUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error advancing tailoring milestone');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-900 text-white rounded-xl">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Update Tailoring Milestone</h3>
              <p className="text-xs text-gray-500">Order {orderNumber}</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Garment Progress Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
            >
              {TAILORING_STAGES_LIST.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Milestone Progress & Fitting Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Master cutter finished marking. Trial fitting ready for Thursday 4 PM."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              This update will reflect immediately in the customer&apos;s personal account timeline.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
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
              className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Updating...' : 'Publish Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
