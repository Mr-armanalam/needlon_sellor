'use client';
import React, { useState } from 'react';
import { Truck, CheckCircle2, Settings } from 'lucide-react';
import { useDelivery } from '@/modules/delivery/hooks/use-delivery';
import ConnectCarrierModal from './modals/connect-carrier-modal';

export default function DeliveryOverview() {
  const { partners, counts, loading, connectCarrier } = useDelivery();
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  const displayPartners = partners.length > 0 ? partners : [
    { id: 'p1', partnerCode: 'FEDEX', partnerName: 'FedEx Express (Sandbox)', isActive: true },
    { id: 'p2', partnerCode: 'SHIPROCKET', partnerName: 'Shiprocket India (Sandbox API)', isActive: true },
    { id: 'p3', partnerCode: 'SHIPPO', partnerName: 'Shippo Test API (Global)', isActive: true },
    { id: 'p4', partnerCode: 'INHOUSE', partnerName: 'In-House Local Fleet', isActive: true }
  ];

  const logoBgs = [
    'bg-indigo-50 text-indigo-600',
    'bg-amber-50 text-amber-600',
    'bg-blue-50 text-blue-600',
    'bg-emerald-50 text-emerald-600'
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {displayPartners.map((partner, index) => (
          <div key={partner.id || index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-3 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`p-2 rounded-xl text-xs font-semibold ${logoBgs[index % logoBgs.length]}`}>
                  <Truck className="w-4 h-4" />
                </span>
                <h4 className="text-xs font-bold text-gray-900 truncate">{partner.partnerName || partner.name}</h4>
              </div>
              <button
                onClick={() => setSelectedPartner(partner)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                title="Carrier Credentials"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-50">
              <p className="text-[11px] text-gray-500 font-medium">
                {loading ? "Loading..." : `${counts.inTransit || 0} in transit`}
              </p>
              <button
                onClick={() => setSelectedPartner(partner)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1 hover:bg-green-100 transition-colors"
              >
                <CheckCircle2 className="w-3 h-3" /> {partner.isActive ? 'Connected' : 'Configure'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConnectCarrierModal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner}
        onSubmit={async (dto) => {
          await connectCarrier(dto);
        }}
      />
    </>
  );
}