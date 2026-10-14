'use client';

import React, { useState } from 'react';
import { Package, Printer, Compass, ArrowUpRight } from 'lucide-react';
import { useDelivery } from '../hooks/use-delivery';
import ShippingLabelModal from './modals/shipping-label-modal';
import TrackingTimelineModal from './modals/tracking-timeline-modal';

import Link from 'next/link';

export default function ShipmentDispatchTable() {
  const { shipments, loading, updateStatus } = useDelivery();
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<'label' | 'track' | null>(null);

  const displayShipments = shipments;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Active Shipments & Dispatch Workflow</h3>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {loading ? "Loading dispatches..." : `${displayShipments.length} active dispatches`}
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading seller dispatches...</div>
      ) : displayShipments.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
          <Package className="w-8 h-8 text-gray-300" />
          <p className="text-xs font-semibold text-gray-600">No active dispatches found</p>
          <p className="text-[11px] text-gray-400 max-w-sm">
            Confirmed customer orders requiring local dispatch or doorstep fulfillment will automatically sync here.
          </p>
        </div>
      ) : (
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3">Order / Buyer</th>
                <th className="p-3">Logistics Partner / Executive</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {displayShipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3">
                    <Link
                      href={`/orders/${shp.rawOrderId || shp.orderId}`}
                      className="font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                    >
                      <span>{shp.orderId}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                    </Link>
                    <span className="text-[10px] font-medium text-gray-500 block">
                      {shp.buyerName ? `Buyer: ${shp.buyerName} • ` : ""}<span className="font-mono text-gray-400">{shp.awbNumber || shp.shipmentNumber}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800 block">{shp.partnerName}</span>
                    {shp.executive ? (
                      <span className="text-[10px] font-medium text-indigo-600 block">
                        Assigned: {shp.executive.executiveName} ({shp.executive.executivePhone})
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">{shp.methodName}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      value={shp.status}
                      onChange={async (e) => {
                        await updateStatus(shp.id, e.target.value);
                      }}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
                        shp.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : shp.status === 'IN_TRANSIT' || shp.status === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="READY_TO_SHIP">Ready to Ship</option>
                      <option value="PICKED_UP">Picked Up</option>
                      <option value="IN_TRANSIT">In Transit</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>

                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedShipment(shp);
                          setActiveModal('label');
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" /> Label
                      </button>
                      <button
                        onClick={() => {
                          setSelectedShipment(shp);
                          setActiveModal('track');
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
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
      )}


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
