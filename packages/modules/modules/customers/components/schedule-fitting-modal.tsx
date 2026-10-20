'use client';


import { apiFetch } from "@/modules/auth/lib/auth-client";
import React, { useState } from 'react';
import { X, Calendar, Clock, Scissors, UserCheck, Loader2 } from 'lucide-react';

interface ScheduleFittingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  onScheduled: () => void;
}

export default function ScheduleFittingModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  customerId,
  customerName,
  onScheduled,
}: ScheduleFittingModalProps) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [tailorMasterName, setTailorMasterName] = useState('Master Tailor');
  const [fittingNotes, setFittingNotes] = useState('First basting trial fitting session.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      setError('Please select appointment date and time');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/api/seller/fittings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMinutes,
          tailorMasterName,
          fittingNotes: fittingNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to schedule fitting session');
      }

      onScheduled();
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message || 'Error scheduling fitting session' : 'Error scheduling fitting session',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Schedule In-Store Trial Fitting</h3>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Appointment Date & Time *
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Duration (Minutes)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value={15}>15 Minutes (Quick Check)</option>
                <option value={30}>30 Minutes (Standard Basting)</option>
                <option value={45}>45 Minutes (Full Suit Fitting)</option>
                <option value={60}>60 Minutes (Bridal / Tuxedo)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Master Tailor Conducting Session
            </label>
            <input
              type="text"
              value={tailorMasterName}
              onChange={(e) => setTailorMasterName(e.target.value)}
              placeholder="e.g. Master Sartorialist Ahmed"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Trial Fitting Instructions & Notes
            </label>
            <textarea
              rows={3}
              value={fittingNotes}
              onChange={(e) => setFittingNotes(e.target.value)}
              placeholder="Instructions for basting stitch, shoulder slope test, collar drop, etc."
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-purple-950">
              <Scissors className="w-3.5 h-3.5" /> Milestone Automated Progression
            </p>
            <p className="text-[11px] text-purple-800">
              Scheduling this session automatically advances order milestone to <strong>TRIAL_FITTING</strong> and notifies the customer in their personal account feed.
            </p>
          </div>

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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Booking Session...
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  Book & Notify Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
