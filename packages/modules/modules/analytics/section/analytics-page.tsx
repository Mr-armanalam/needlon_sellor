'use client';
import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import AnalyticsGrid from '../view/analytics-grid';
import InsightPanels from '../view/insight-pannels';
import { useAnalytics } from '../hooks/use-analytics';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const { data } = useAnalytics(timeframe);

  const handleExportCsv = () => {
    if (!data) return;
    const headers = ["Date", "Revenue (INR)", "Orders"];
    const rows = (data.revenueChart || []).map((r) => [r.date, r.revenue, r.orders]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `store_analytics_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timeframes: Array<{ id: "7d" | "30d" | "90d" | "1y"; label: string }> = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "1y", label: "1 Year" },
  ];

  return (
    /* Strictly sized layout boundaries to prevent full-frame scroll leaks */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-y-auto p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* Header Panel with Timeframe Selector and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Store Insights</h1>
          <p className="text-xs text-gray-400 mt-0.5">Plain-language translations of your shop&apos;s recent buyer and data patterns.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector Pills */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-semibold">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === tf.id
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Section: Plain English High Level Cards */}
      <AnalyticsGrid timeframe={timeframe} />

      {/* Lower Section: Traffic, Top Products, and Recommendations */}
      <InsightPanels timeframe={timeframe} />

    </div>
  );
}