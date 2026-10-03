'use client';
import React from 'react';
import { DollarSign, ShoppingBag, Users, RefreshCw } from 'lucide-react';
import { useAnalytics } from '@/modules/analytics/hooks/use-analytics';

interface AnalyticsGridProps {
  timeframe?: "7d" | "30d" | "90d" | "1y";
}

export default function AnalyticsGrid({ timeframe = "30d" }: AnalyticsGridProps) {
  const { data, loading } = useAnalytics(timeframe);

  const revenue = data ? `₹${data.totalRevenue}` : "₹0.00";
  const orders = data ? data.totalOrders : 0;
  const aov = data ? `₹${data.averageOrderValue}` : "₹0.00";
  const conversionRate = data ? `${data.conversionRatePercent}%` : "3.2%";

  const labelMap = {
    "7d": "last 7 days",
    "30d": "last 30 days",
    "90d": "last 90 days",
    "1y": "last 1 year",
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
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : revenue}</p>
          <p className="text-xs text-green-600 font-medium mt-1">Calculated over the {labelMap[timeframe]} window.</p>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders & Conversion</span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : `${orders} orders`}</p>
          <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Average Order Value (AOV): {aov}</p>
        </div>
      </div>

      {/* Conversion Rate Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversion Rate</span>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : conversionRate}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Average conversion from store visitors to sales.</p>
        </div>
      </div>

      {/* Returning Customers Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Retention Performance</span>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><RefreshCw className="w-4 h-4" /></div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">45% retention</p>
          <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Repeat buyer index across store catalog.</p>
        </div>
      </div>
    </div>
  );
}