import React, { useState } from 'react';
import { Map, ShoppingBag, Truck, DollarSign, Globe } from 'lucide-react';

export default function DeliverySettingsTabs() {
  const [activeTab, setActiveTab] = useState('local'); // local, pickup, zones

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0 flex-1 overflow-hidden">
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
          <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900">Local Delivery Parameters</h3>
              <p className="text-xs text-gray-400">Fulfill adjacent orders using your own regional vehicle courier fleet.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Maximum Radius Range</label>
                <div className="relative">
                  <input type="number" defaultValue={15} className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs pl-4 pr-10 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">km</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Base Delivery Charge</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                  <input type="number" defaultValue={5.00} className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs pl-8 pr-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELF PICKUP */}
        {activeTab === 'pickup' && (
          <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900">In-Store Pickup Settings</h3>
              <p className="text-xs text-gray-400">Allow localized clients to buy online and claim boxes directly from physical fulfillment hubs.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
              <Map className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-800">Primary Pickup Address Location</p>
                <p className="text-xs text-gray-500 leading-relaxed">Needlon Hub Main Warehouse Block-C, Industrial Electronics Sector, Pimpri-Chinchwad, India</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SHIPPING ZONES */}
        {activeTab === 'zones' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1 mb-2">
              <h3 className="text-sm font-bold text-gray-900">Geographic Shipping Zones</h3>
              <p className="text-xs text-gray-400">Configure multi-region courier rules and automatic freight fee assessments.</p>
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
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">Domestic (All States)</td>
                    <td className="p-3 text-gray-500">FedEx Standard Tracking</td>
                    <td className="p-3 text-right font-bold text-gray-900">$12.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">International (EU & NA)</td>
                    <td className="p-3 text-gray-500">DHL Express Priority</td>
                    <td className="p-3 text-right font-bold text-gray-900">$45.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}