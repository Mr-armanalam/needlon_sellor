'use client';

import React, { useState } from 'react';
import { X, Truck, Key, ShieldCheck } from 'lucide-react';
import { ConnectCarrierDto } from '../../dto/delivery.dto';

interface ConnectCarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: any | null;
  onSubmit: (dto: ConnectCarrierDto) => Promise<void>;
}

export default function ConnectCarrierModal({
  isOpen,
  onClose,
  partner,
  onSubmit,
}: ConnectCarrierModalProps) {
  const [apiKey, setApiKey] = useState('sbx_test_key_89127391');
  const [apiSecret, setApiSecret] = useState('');
  const [isSandbox, setIsSandbox] = useState(true);
  const [isActive, setIsActive] = useState(partner?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        partnerId: partner.id || 'p-1',
        partnerCode: partner.partnerCode || 'SHIPROCKET',
        apiKey,
        apiSecret,
        isSandbox,
        isActive,
      });
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
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Carrier Partner Settings</h3>
              <p className="text-[11px] text-gray-400">{partner.partnerName || partner.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-gray-400" /> API Token / Sandbox Secret Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g. shippo_test_12345 or shiprocket_token"
              className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-gray-800">Sandbox / Developer Test Mode</p>
                <p className="text-[10px] text-gray-400">Use test API endpoints without live billing</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isSandbox}
              onChange={(e) => setIsSandbox(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-800">Enable Partner Integration</p>
              <p className="text-[10px] text-gray-400">Allow orders to be dispatched via this courier</p>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
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
              className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
