'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { EarningsAnalyticsResponseDto } from '../dto/finance.dto';
import { useEarnings } from '../hooks/use-earnings';

interface IncomeAnalyticsProps {
  analytics?: EarningsAnalyticsResponseDto | null;
  timeframe?: 'weekly' | 'monthly';
  loading?: boolean;
  onTimeframeChange?: (tf: 'weekly' | 'monthly') => void;
}

export default function IncomeAnalytics({
  analytics: propAnalytics,
  timeframe: propTimeframe,
  loading: propLoading,
  onTimeframeChange,
}: IncomeAnalyticsProps) {
  const fallbackHook = useEarnings();
  const [localTimeframe, setLocalTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const timeframe = propTimeframe !== undefined ? propTimeframe : localTimeframe;
  const analytics = propAnalytics !== undefined ? propAnalytics : fallbackHook.analytics;

  const handleTimeframeToggle = (tf: 'weekly' | 'monthly') => {
    setLocalTimeframe(tf);
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    } else {
      fallbackHook.setTimeframe(tf);
    }
  };

  const defaultWeeklyBars = [
    { label: 'M', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
    { label: 'T', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
    { label: 'W', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
    { label: 'T', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
    { label: 'F', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
    { label: 'S', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
    { label: 'S', amount: 0, formattedAmount: '₹0.00', heightPercentage: 15 },
  ];

  const defaultMonthlyBars = Array.from({ length: 12 }, (_, i) => ({
    label: `M${i + 1}`,
    amount: 0,
    formattedAmount: '₹0.00',
    heightPercentage: 15,
  }));

  const activeBars = analytics?.bars && analytics.bars.length > 0
    ? analytics.bars
    : timeframe === 'weekly'
    ? defaultWeeklyBars
    : defaultMonthlyBars;

  const breakdownData = analytics?.channelBreakdown && analytics.channelBreakdown.length > 0
    ? analytics.channelBreakdown
    : [
        { label: 'Direct Storefront Sales', amount: '₹0.00', percentage: '0%' },
        { label: 'Custom Configuration Orders', amount: '₹0.00', percentage: '0%' },
        { label: 'Re-orders & Subscriptions', amount: '₹0.00', percentage: '0%' },
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
      {/* Interactive Timeframe Graph Platform Block */}
      <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Revenue Performance</h3>
          </div>
          {/* Chart Toggle Controllers */}
          <div className="bg-gray-50 border border-gray-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => handleTimeframeToggle('weekly')}
              className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeframe === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => handleTimeframeToggle('monthly')}
              className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeframe === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly View
            </button>
          </div>
        </div>

        {/* Dynamic Chart Visualization Bars */}
        <div className="flex-1 h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100">
          {activeBars.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
              <div 
                className="w-full bg-blue-500/10 group-hover:bg-blue-600 rounded-t-md transition-all relative flex justify-center"
                style={{ height: `${bar.heightPercentage}%` }}
              >
                {/* Floating Value Bubble with real ₹ amount */}
                <span className="absolute -top-7 bg-gray-900 text-white text-[10px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-sm">
                  {bar.formattedAmount}
                </span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Revenue Streams Panel */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Income Breakdown</h3>
          </div>
          <p className="text-xs text-gray-400">Channel revenue performance tracking.</p>
        </div>

        <div className="space-y-4 my-4">
          {breakdownData.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 truncate mr-2">{item.label}</span>
                <span className="text-gray-900 font-semibold">{item.amount}</span>
              </div>
              {/* Progress Loading Track */}
              <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: item.percentage }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}