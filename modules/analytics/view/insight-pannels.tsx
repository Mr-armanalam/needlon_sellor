import React from "react";
import { Compass, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

export default function InsightPanels() {
  const trafficSources = [
    {
      source: "Instagram Ads",
      share: "55%",
      count: "6,160 visitors",
      color: "bg-pink-500",
    },
    {
      source: "Google Search",
      share: "30%",
      count: "3,360 visitors",
      color: "bg-blue-500",
    },
    {
      source: "Direct URL / Email",
      share: "15%",
      count: "1,680 visitors",
      color: "bg-gray-400",
    },
  ];

  const popularProducts = [
    {
      name: "Minimalist Leather Sneakers",
      sales: "142 sold this week",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100",
    },
    {
      name: "Classic Canvas Tote",
      sales: "98 sold this week",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=100",
    },
  ];

  const recommendations = [
    {
      title: "Restock Warning",
      body: "Minimalist Leather Sneakers are converting fast. At this rate, you will run out of stock in 4 days.",
      action: "Create Restock Order",
    },
    {
      title: "Marketing Opportunity",
      body: "Traffic from Instagram is buying 2x more than Google searchers. Consider putting more budget there.",
      action: "Boost Campaigns",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
      {/* 1. Traffic Sources Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">
              Where Visitors Come From
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            A simple breakdown of your store access entry points.
          </p>

          <div className="space-y-4">
            {trafficSources.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">
                    {item.source}
                  </span>
                  <span className="text-gray-400">
                    {item.count} ({item.share})
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-50 border border-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Popular Products Spotlight */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">
              Top Performing Items
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            The products driving the majority of your store revenue.
          </p>

          <div className="space-y-3">
            {popularProducts.map((prod, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-2.5 rounded-xl"
              >
                <img
                  src={prod.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-green-600 font-medium mt-0.5">
                    {prod.sales}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Actionable Smart Recommendations */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-900">
              Smart Recommendations
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Automated actions computed to increase your conversion velocity.
          </p>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="border border-blue-100 bg-blue-50/30 rounded-xl p-3 space-y-2"
              >
                <h4 className="text-xs font-bold text-blue-900">{rec.title}</h4>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {rec.body}
                </p>
                <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                  {rec.action} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
