'use client';
import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { useDelivery } from '@/modules/delivery/hooks/use-delivery';

export default function DeliveryOverview() {
  const { partners, counts, loading } = useDelivery();

  const displayPartners = partners.length > 0 ? partners : [
    { partnerName: 'FedEx Express', isActive: true },
    { partnerName: 'DHL International', isActive: true },
    { partnerName: 'In-House Local Fleet', isActive: true }
  ];

  const logoBgs = [
    'bg-indigo-50 text-indigo-600',
    'bg-amber-50 text-amber-600',
    'bg-emerald-50 text-emerald-600'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
      {displayPartners.map((partner, index) => (
        <div key={partner.id || index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl text-xs font-semibold ${logoBgs[index % logoBgs.length]}`}>
                <Truck className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-gray-900 truncate">{partner.partnerName || partner.name}</h4>
            </div>
            <p className="text-xs text-gray-500 font-medium pl-1">
              {loading ? "Loading..." : `${counts.inTransit || 0} packages currently in transit`}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {partner.isActive ? 'Connected' : 'Active'}
          </span>
        </div>
      ))}
    </div>
  );
}