import React from 'react';
import { Truck, Package, MapPin, CheckCircle2 } from 'lucide-react';

export default function DeliveryOverview() {
  const activePartners = [
    { name: 'FedEx Express', status: 'Connected', activeShipments: 14, logoBg: 'bg-indigo-50 text-indigo-600' },
    { name: 'DHL International', status: 'Connected', activeShipments: 5, logoBg: 'bg-amber-50 text-amber-600' },
    { name: 'In-House Local Fleet', status: 'Active', activeShipments: 8, logoBg: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
      {activePartners.map((partner, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl text-xs font-semibold ${partner.logoBg}`}>
                <Truck className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-gray-900 truncate">{partner.name}</h4>
            </div>
            <p className="text-xs text-gray-500 font-medium pl-1">
              {partner.activeShipments} packages currently in transit
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {partner.status}
          </span>
        </div>
      ))}
    </div>
  );
}