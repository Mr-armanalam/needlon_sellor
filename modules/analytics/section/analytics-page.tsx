'use client'
import React from 'react';
import AnalyticsGrid from '../view/analytics-grid';
import InsightPanels from '../view/insight-pannels';


export default function AnalyticsPage() {
  return (
    /* Strictly sized layout boundaries to prevent full-frame scroll leaks */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-y-auto p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* Header Panel */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Store Insights</h1>
        <p className="text-xs text-gray-400 mt-0.5">Plain-language translations of your shop&apos;s recent buyer and data patterns.</p>
      </div>

      {/* Top Section: Plain English High Level Cards */}
      <AnalyticsGrid />

      {/* Lower Section: Traffic, Top Products, and Recommendations */}
      <InsightPanels />

    </div>
  );
}