import React from 'react';
import { DollarSign, ShoppingBag, Users, RefreshCw } from 'lucide-react';

export default function AnalyticsGrid() {
  const stats = {
    revenue: "$14,250",
    revenueGrowth: "+12%",
    orders: 340,
    visitors: 11200,
    conversionText: "3 out of every 100 visitors bought your products.",
    returningText: "45 out of every 100 customers came back to buy again."
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
      {/* Revenue Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><DollarSign className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.revenue}</p>
          <p className="text-xs text-green-600 font-medium mt-1">Your total sales grew by {stats.revenueGrowth} this week.</p>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders & Conversion</span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.orders} orders</p>
          <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{stats.conversionText}</p>
        </div>
      </div>

      {/* Visitors Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Traffic & Visitors</span>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.visitors.toLocaleString()} visitors</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Most of your traffic came directly from Instagram links.</p>
        </div>
      </div>

      {/* Returning Customers Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Returning Customers</span>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><RefreshCw className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">45% retention</p>
          <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{stats.returningText}</p>
        </div>
      </div>
    </div>
  );
}