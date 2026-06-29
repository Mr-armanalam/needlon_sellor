import React from 'react';
import { Star, ArrowUpRight, MessageSquare, AlertTriangle } from 'lucide-react';

export default function ReviewAnalytics() {
  // Mock aggregated metric analytics
  const metrics = {
    averageRating: 4.8,
    totalReviews: 1240,
    replyRate: "94%",
    pendingReports: 2
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
      {/* Average Rating Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Rating</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{metrics.averageRating}</span>
            <span className="text-xs text-gray-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Star className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Total Volume Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalReviews.toLocaleString()}</p>
          <p className="text-xs text-green-600 flex items-center gap-0.5 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +12% this month
          </p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>

      {/* Seller Reply Rate */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Review Reply Rate</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.replyRate}</p>
          <p className="text-xs text-gray-400">Target goal: &gt;90%</p>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>

      {/* Flagged/Reported Content Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Flagged/Reports</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.pendingReports}</p>
          <p className="text-xs text-gray-400">Requires review moderation</p>
        </div>
        <div className={`p-3 rounded-xl ${metrics.pendingReports > 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}