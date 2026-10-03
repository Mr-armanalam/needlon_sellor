'use client';

import React, { useState } from 'react';
import { X, Users2, Copy, Check, Sparkles } from 'lucide-react';
import { ReferralInfoDto, CreateReferralDto } from '../../dto/marketing.dto';

interface ReferralProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: ReferralInfoDto | null;
  onSubmit: (dto: CreateReferralDto) => Promise<void>;
}

export default function ReferralProgramModal({
  isOpen,
  onClose,
  referral,
  onSubmit,
}: ReferralProgramModalProps) {
  const [code, setCode] = useState(referral?.referralCode || 'STORE-REF100');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (referral?.shareUrl) {
      navigator.clipboard.writeText(referral.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        campaignName: 'STORE_REFERRAL',
        referralCode: code.toUpperCase(),
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
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Referral Program Settings</h3>
              <p className="text-[11px] text-gray-400">Reward buyers for driving sales</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-50/40 border border-purple-100 p-3 rounded-xl">
            <span className="text-[10px] text-purple-600 font-bold uppercase block mb-0.5">Total Referrals</span>
            <span className="text-lg font-bold text-gray-900">{referral?.totalReferrals || 0} buyers</span>
          </div>
          <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl">
            <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-0.5">Total Rewards Paid</span>
            <span className="text-lg font-bold text-gray-900">{referral?.rewardsEarned || '₹0.00'}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Store Referral Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Invite Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referral?.shareUrl || `https://needlon.com/join?ref=${code}`}
                className="flex-1 px-3 py-2 text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
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
              className="flex-1 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
