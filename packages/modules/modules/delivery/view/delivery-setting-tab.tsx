'use client';

import React, { useState } from 'react';
import { Map, ShoppingBag, Truck, DollarSign, Globe, Plus, Check, Edit2 } from 'lucide-react';
import { useDelivery } from '../hooks/use-delivery';
import EditPickupHubModal from './modals/edit-pickup-hub-modal';
import AddShippingZoneModal from './modals/add-shipping-zone-modal';

export default function DeliverySettingsTabs() {
  const [activeTab, setActiveTab] = useState('local'); // local, pickup, zones
  const { settings, updateDeliverySettings } = useDelivery();

  const [radiusKm, setRadiusKm] = useState(15);
  const [baseCharge, setBaseCharge] = useState(5.0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  const localRadius = settings?.localRadius || { maxRadiusKm: 15, baseCharge: 5.0 };
  const pickupHub = settings?.pickupHub || {
    hubName: 'Needlon Hub Main Warehouse',
    address: 'Block-C, Industrial Electronics Sector, Pimpri-Chinchwad, India',
    phone: '+91 98765 43210',
    operatingHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
  };
  const zones = settings?.zones || [
    { zoneName: 'Domestic (All States)', partnerCode: 'FEDEX', flatRateFee: 12.0, estimatedDays: '2-4 days' },
    { zoneName: 'International (EU & NA)', partnerCode: 'DHL', flatRateFee: 45.0, estimatedDays: '4-7 days' },
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveLocalRadius = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDeliverySettings('LOCAL_RADIUS', {
      maxRadiusKm: Number(radiusKm),
      baseCharge: Number(baseCharge),
    });
    showToast('Local delivery parameters saved!');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-auto flex-1  relative">
      {/* Toast Popup */}
      {toastMsg && (
        <div className="absolute top-4 right-4 z-40 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* Tab Select Toolbar */}
      <div className="p-4 border-b border-gray-50 flex items-center gap-4 flex-shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('local')}
          className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'local' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
          }`}
        >
          <Truck className="w-3.5 h-3.5" /> Local Delivery Radius
        </button>
        <button
          onClick={() => setActiveTab('pickup')}
          className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pickup' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Self Pickup Options
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'zones' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Shipping Zones & Charges
        </button>
      </div>

      {/* Dynamic Tab Panels Context */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        
        {/* TAB 1: LOCAL DELIVERY */}
        {activeTab === 'local' && (
          <form onSubmit={handleSaveLocalRadius} className="space-y-6 max-w-xl animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900">Local Delivery Parameters</h3>
              <p className="text-xs text-gray-400">Fulfill adjacent orders using your own regional vehicle courier fleet.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Maximum Radius Range</label>
                <div className="relative">
                  <input
                    type="number"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs pl-4 pr-10 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">km</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Base Delivery Charge</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="number"
                    step="0.5"
                    value={baseCharge}
                    onChange={(e) => setBaseCharge(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs pl-8 pr-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Save Local Parameters
            </button>
          </form>
        )}

        {/* TAB 2: SELF PICKUP */}
        {activeTab === 'pickup' && (
          <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">In-Store Pickup Settings</h3>
                <p className="text-xs text-gray-400">Allow localized clients to buy online and claim boxes directly from physical fulfillment hubs.</p>
              </div>
              <button
                onClick={() => setIsPickupModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Hub
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
              <Map className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-800">{pickupHub.hubName}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{pickupHub.address}, {pickupHub.city || ''} {pickupHub.pincode || ''}</p>
                <p className="text-[11px] text-gray-400 font-medium">Contact: {pickupHub.phone} • {pickupHub.operatingHours}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SHIPPING ZONES */}
        {activeTab === 'zones' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">Geographic Shipping Zones</h3>
                <p className="text-xs text-gray-400">Configure multi-region courier rules and automatic freight fee assessments.</p>
              </div>
              <button
                onClick={() => setIsZoneModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Zone Rate
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Zone Region</th>
                    <th className="p-3">Fulfillment Partner</th>
                    <th className="p-3 text-right">Flat Rate Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  {zones.map((z: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-gray-900">{z.zoneName}</td>
                      <td className="p-3 text-gray-500">{z.partnerCode} ({z.estimatedDays || '2-4 days'})</td>
                      <td className="p-3 text-right font-bold text-gray-900">${z.flatRateFee.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      <EditPickupHubModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        hub={pickupHub}
        onSubmit={async (dto) => {
          await updateDeliverySettings('PICKUP_HUB', dto);
          showToast('Pickup warehouse location updated!');
        }}
      />

      <AddShippingZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        onSubmit={async (dto) => {
          await updateDeliverySettings('SHIPPING_ZONE', dto);
          showToast('New shipping zone rate added!');
        }}
      />
    </div>
  );
}