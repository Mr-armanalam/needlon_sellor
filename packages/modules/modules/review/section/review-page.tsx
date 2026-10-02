'use client'
import React, { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import ReviewAnalytics from '../view/review-analytix';
import ReviewRow from '../view/review-row';
import { useSellerReviews } from '../hooks/use-seller-reviews';
import { useReportReview } from '../hooks/use-report-review';

export default function ReviewsPage() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const { data, isLoading, isError, error } = useSellerReviews({
    page: 1,
    limit: 20,
    search: search.trim() || undefined,
    rating: ratingFilter === 'all' ? undefined : parseInt(ratingFilter)
  });

  const reportReviewMutation = useReportReview();

  const handleReportAction = (id: string) => {
    const reason = prompt("Please enter the reason for flagging this review:");
    if (!reason || !reason.trim()) return;

    reportReviewMutation.mutate({
      reviewId: id,
      reason: reason.trim()
    }, {
      onSuccess: () => {
        alert("Review reported successfully.");
      },
      onError: (err) => {
        alert(err instanceof Error ? err.message : "Failed to report review");
      }
    });
  };

  return (
    /* Constrained height layout to integrate seamlessly inside your SellerLayout dimensions */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6">
      
      {/* Header Metadata Section */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reviews & Moderation</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage customer sentiment, product ratings, and feedback lines.</p>
        </div>
      </div>

      {/*  Aggregate Analytics Metrics Grid */}
      <ReviewAnalytics />

      {/* Operational Toolbar (Filter / Search) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3 shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search within text or client names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full sm:w-40 bg-gray-50 border border-gray-200 rounded-xl text-xs px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="all">All Stars Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Independent Scrollable Reviews Feed List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {isLoading ? (
          /* Pulsing skeleton loaders */
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-pulse">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-150" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 bg-gray-150 rounded" />
                    <div className="h-2 bg-gray-100 rounded w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-4 w-28 bg-gray-100 rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-150 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : isError ? (
          <div className="bg-red-50 rounded-2xl border border-red-100 p-12 text-center text-xs text-red-600 shadow-sm">
            {error instanceof Error ? error.message : "Unable to load customer reviews."}
          </div>
        ) : data?.items && data.items.length > 0 ? (
          data.items.map((review) => {
            const mappedReview = {
              id: review.id,
              customerName: review.buyer.name,
              avatar: review.buyer.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              date: new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }),
              rating: review.rating,
              productTitle: review.product.name,
              title: review.title || '',
              comment: review.content || '',
              reply: review.reply || null
            };

            return (
              <ReviewRow 
                key={review.id} 
                review={mappedReview} 
                onReport={handleReportAction} 
              />
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
            No active customer reviews match your filter parameters.
          </div>
        )}
      </div>

    </div>
  );
}