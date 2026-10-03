'use client';

import React, { useState } from 'react';
import { Share2, Users2, Ticket, QrCode, CreditCard, MessageSquare, ExternalLink, Trash2, Check } from 'lucide-react';
import { useCoupons, useReferrals } from '../hooks/use-marketing';
import CreateCouponModal from './modals/create-coupon-modal';
import QRCodeModal from './modals/qr-code-modal';
import BusinessCardModal from './modals/business-card-modal';
import ReferralProgramModal from './modals/referral-program-modal';

export default function MarketingToolkit() {
  const { coupons, createCoupon, deleteCoupon } = useCoupons();
  const { referral, updateReferral } = useReferrals();

  const [activeModal, setActiveModal] = useState<'coupon' | 'qr' | 'card' | 'referral' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyShopLink = () => {
    const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store` : 'https://needlon.com/store';
    navigator.clipboard.writeText(storeUrl);
    showToast('Store public link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store` : 'https://needlon.com/store';
    const text = encodeURIComponent(`Check out our official online store on Needlon: ${storeUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const tools = [
    {
      id: 'share',
      title: 'Share Shop Link',
      desc: 'Copy and distribute your public store path URL across networks.',
      icon: <Share2 className="w-4 h-4 text-blue-600" />,
      actionLabel: 'Copy Link',
      onClick: handleCopyShopLink,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Sharing',
      desc: 'Instantly blast current shop collections to individual buyer threads.',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      actionLabel: 'Open WhatsApp',
      onClick: handleWhatsAppShare,
    },
    {
      id: 'referral',
      title: 'Referral Program',
      desc: 'Configure invite structures giving customers rewards for driving sales.',
      icon: <Users2 className="w-4 h-4 text-purple-600" />,
      actionLabel: 'Manage Invites',
      onClick: () => setActiveModal('referral'),
    },
    {
      id: 'coupon',
      title: 'Coupons & Promos',
      desc: 'Generate unique alphanumeric percentage-off discount tokens.',
      icon: <Ticket className="w-4 h-4 text-amber-600" />,
      actionLabel: 'Create Coupon',
      onClick: () => setActiveModal('coupon'),
    },
    {
      id: 'qr',
      title: 'Dynamic QR Codes',
      desc: 'Export high-definition print graphics routing clients directly to products.',
      icon: <QrCode className="w-4 h-4 text-indigo-600" />,
      actionLabel: 'Generate PNG',
      onClick: () => setActiveModal('qr'),
    },
    {
      id: 'card',
      title: 'Digital Business Cards',
      desc: 'Create print-ready layouts complete with contact info and store branding.',
      icon: <CreditCard className="w-4 h-4 text-rose-600" />,
      actionLabel: 'Export PDF',
      onClick: () => setActiveModal('card'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Growth & Distribution Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
                    {tool.icon}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{tool.title}</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
              </div>
              
              <button
                onClick={tool.onClick}
                className="mt-4 pt-3 border-t border-gray-50 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-between group"
              >
                {tool.actionLabel}
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Coupons Section */}
      {coupons.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-gray-900">Active Coupons & Discounts</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {coupons.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                      {c.couponCode}
                    </span>
                    <span className="text-xs font-semibold text-gray-800">{c.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`} • {c.totalRedemptions} redemptions
                  </p>
                </div>
                <button
                  onClick={() => deleteCoupon(c.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCouponModal
        isOpen={activeModal === 'coupon'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (dto) => {
          await createCoupon(dto);
          showToast('Coupon published successfully!');
        }}
      />

      <QRCodeModal
        isOpen={activeModal === 'qr'}
        onClose={() => setActiveModal(null)}
      />

      <BusinessCardModal
        isOpen={activeModal === 'card'}
        onClose={() => setActiveModal(null)}
      />

      <ReferralProgramModal
        isOpen={activeModal === 'referral'}
        onClose={() => setActiveModal(null)}
        referral={referral}
        onSubmit={async (dto) => {
          await updateReferral(dto);
          showToast('Referral program saved!');
        }}
      />
    </div>
  );
}