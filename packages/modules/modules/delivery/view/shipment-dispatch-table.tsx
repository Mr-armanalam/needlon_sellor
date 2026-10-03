'use client';

import React, { useState } from 'react';
import { Package, Printer, Compass, ArrowUpRight } from 'lucide-react';
import { useDelivery } from '../hooks/use-delivery';
import ShippingLabelModal from './modals/shipping-label-modal';
import TrackingTimelineModal from './modals/tracking-timeline-modal';

export default function ShipmentDispatchTable() {
  const { shipments, loading } = useDelivery();
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<'label' | 'track' | null>(null);

  const displayShipments = shipments.length > 0 ? shipments : [
    {
      id: "shp-1",
      orderId: "ORD-98234",
      shipmentNumber: "SHP-K891-921",
      awbNumber: "FDX-AWB-89127381",
      trackingNumber: "TRK-98127389",
      partnerName: "FedEx Express (Sandbox)",
      methodName: "FedEx Standard Air",
      status: "IN_TRANSIT",
      shippingCost: "12.00",
    },
    {
      id: "shp-2",
      orderId: "ORD-98235",
      shipmentNumber: "SHP-K891-922",
      awbNumber: "SR-AWB-47192831",
      trackingNumber: "TRK-47192831",
      partnerName: "Shiprocket India (Sandbox API)",
      methodName: "Surface Express",
      status: "READY_FOR_PICKUP",
      shippingCost: "8.50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Active Shipments & Dispatch Workflow</h3>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {loading ? "Loading..." : `${displayShipments.length} active dispatches`}
        </span>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-3">Order / AWB</th>
              <th className="p-3">Logistics Partner</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
            {displayShipments.map((shp) => (
              <tr key={shp.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-3">
                  <span className="font-bold text-gray-900 block">{shp.orderId}</span>
                  <span className="text-[10px] font-mono text-gray-400">{shp.awbNumber}</span>
                </td>
                <td className="p-3">
                  <span className="font-semibold text-gray-800 block">{shp.partnerName}</span>
                  <span className="text-[10px] text-gray-400">{shp.methodName}</span>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    shp.status === 'DELIVERED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : shp.status === 'IN_TRANSIT'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {shp.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedShipment(shp);
                        setActiveModal('label');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" /> Label
                    </button>
                    <button
                      onClick={() => {
                        setSelectedShipment(shp);
                        setActiveModal('track');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3 text-gray-500" /> Track
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ShippingLabelModal
        isOpen={activeModal === 'label'}
        onClose={() => setActiveModal(null)}
        shipment={selectedShipment}
      />

      <TrackingTimelineModal
        isOpen={activeModal === 'track'}
        onClose={() => setActiveModal(null)}
        shipment={selectedShipment}
      />
    </div>
  );
}
