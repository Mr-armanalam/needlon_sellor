'use client';

import React from 'react';
import { X, CreditCard, Download, Phone, Globe, ShieldCheck } from 'lucide-react';

interface BusinessCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  sellerPhone?: string;
  shopUrl?: string;
}

export default function BusinessCardModal({
  isOpen,
  onClose,
  storeName = 'Needlon Official Store',
  sellerPhone = '+91 98765 43210',
  shopUrl = 'https://needlon.com/store/official-store',
}: BusinessCardModalProps) {
  if (!isOpen) return null;

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Digital Business Card</h3>
              <p className="text-[11px] text-gray-400">Print-ready seller storefront card</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Business Card Canvas */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Seller
              </div>
              <h4 className="text-lg font-black tracking-tight">{storeName}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
              N
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: <strong className="text-white">{sellerPhone}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate max-w-[260px] font-mono text-[11px] text-slate-200">{shopUrl}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 text-[10px] text-slate-400">
            <span>Powered by Needlon Platform</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">SCAN & BUY</span>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleExportPdf}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export PDF / Print
          </button>
        </div>
      </div>
    </div>
  );
}
