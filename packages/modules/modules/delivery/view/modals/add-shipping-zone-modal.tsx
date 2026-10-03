'use client';

import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import { ShippingZoneDto } from '../../dto/delivery.dto';

interface AddShippingZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: ShippingZoneDto) => Promise<void>;
}

export default function AddShippingZoneModal({
  isOpen,
  onClose,
  onSubmit,
}: AddShippingZoneModalProps) {
  const [zoneName, setZoneName] = useState('');
  const [partnerCode, setPartnerCode] = useState('FEDEX');
  const [flatRateFee, setFlatRateFee] = useState<number>(15.0);
  const [estimatedDays, setEstimatedDays] = useState('2-3 days');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ zoneName, partnerCode, flatRateFee, estimatedDays });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Add New Shipping Zone</h3>
              <p className="text-[11px] text-gray-400">Configure regional carrier rates</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Zone Region Name</label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="e.g. North Region Express or Metro Cities"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Partner</label>
              <select
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="FEDEX">FedEx Express</option>
                <option value="SHIPROCKET">Shiprocket India</option>
                <option value="SHIPPO">Shippo Global</option>
                <option value="INHOUSE">In-House Fleet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Flat Rate Fee ($)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={flatRateFee}
                onChange={(e) => setFlatRateFee(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Transit Time</label>
            <input
              type="text"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              placeholder="e.g. 2-3 days or Same Day"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Zone Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
