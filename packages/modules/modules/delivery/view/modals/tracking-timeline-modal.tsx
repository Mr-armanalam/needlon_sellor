'use client';

import React from 'react';
import { X, CheckCircle2, Clock, Truck, MapPin, PackageCheck } from 'lucide-react';

interface TrackingTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment?: any;
}

export default function TrackingTimelineModal({ isOpen, onClose, shipment }: TrackingTimelineModalProps) {
  if (!isOpen) return null;

  const awb = shipment?.awbNumber || 'FDX-AWB-89127381';
  const partner = shipment?.partnerName || 'FedEx Express (Sandbox)';

  const checkpoints = [
    { title: 'Order Dispatched & AWB Assigned', time: 'Today, 09:30 AM', status: 'completed', icon: <PackageCheck className="w-3.5 h-3.5" /> },
    { title: 'Picked Up by Courier Fleet', time: 'Today, 11:45 AM', status: 'completed', icon: <Truck className="w-3.5 h-3.5" /> },
    { title: 'In Transit - Regional Hub Processing', time: 'Today, 02:15 PM', status: 'current', icon: <Clock className="w-3.5 h-3.5" /> },
    { title: 'Out for Delivery to Destination', time: 'Estimated Tomorrow', status: 'upcoming', icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Live Package Tracking</h3>
              <p className="text-[11px] text-gray-400">AWB: {awb}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Courier Partner</span>
            <span className="text-xs font-bold text-gray-800">{partner}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            In Transit
          </span>
        </div>

        {/* Timeline Event Log */}
        <div className="space-y-4 pl-2 py-1">
          {checkpoints.map((cp, idx) => (
            <div key={idx} className="flex items-start gap-3 relative">
              {idx !== checkpoints.length - 1 && (
                <div className={`absolute left-2.5 top-5 bottom-0 w-0.5 ${cp.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              )}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                cp.status === 'completed' ? 'bg-emerald-600 text-white' : cp.status === 'current' ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'
              }`}>
                {cp.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : cp.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-bold ${cp.status === 'completed' ? 'text-gray-900' : cp.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}>
                  {cp.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{cp.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close Tracking Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
