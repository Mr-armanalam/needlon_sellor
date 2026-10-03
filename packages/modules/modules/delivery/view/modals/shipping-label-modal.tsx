'use client';

import React from 'react';
import { X, Printer, Package, ShieldCheck } from 'lucide-react';

interface ShippingLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment?: any;
}

export default function ShippingLabelModal({ isOpen, onClose, shipment }: ShippingLabelModalProps) {
  if (!isOpen) return null;

  const orderId = shipment?.orderId || 'ORD-98234';
  const awb = shipment?.awbNumber || 'FDX-AWB-89127381';
  const partner = shipment?.partnerName || 'FedEx Express (Sandbox)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Printable Shipping Label</h3>
              <p className="text-[11px] text-gray-400">AWB Dispatch Airway Bill</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Shipping Label Box */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-5 space-y-4 shadow-sm text-slate-900">
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Fulfillment Partner</span>
              <h4 className="text-sm font-black uppercase">{partner}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500">PRIORITY PARCEL</span>
              <p className="text-xs font-bold font-mono">{orderId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">FROM (ORIGIN):</span>
              <p className="font-bold">Needlon Fulfillment Hub</p>
              <p className="text-[11px] text-slate-600 leading-tight">Block-C, Industrial Electronics Sector, Pimpri-Chinchwad 411019</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">TO (DESTINATION):</span>
              <p className="font-bold">Rahul Verma</p>
              <p className="text-[11px] text-slate-600 leading-tight">Flat 402, Sunshine Heights, MG Road, Pune 411001</p>
            </div>
          </div>

          {/* Barcode Simulation */}
          <div className="pt-2 border-t-2 border-slate-900 flex flex-col items-center justify-center space-y-1">
            <div className="h-12 w-full flex items-center justify-center gap-1 bg-slate-900 px-4 py-2 rounded">
              {Array.from({ length: 38 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full bg-white ${i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-0.5' : 'w-1'}`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold tracking-widest">{awb}</span>
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
            onClick={handlePrint}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Shipping Label
          </button>
        </div>
      </div>
    </div>
  );
}
