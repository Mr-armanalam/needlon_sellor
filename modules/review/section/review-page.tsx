'use client'
import React, { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import ReviewAnalytics from '../view/review-analytix';
import ReviewRow from '../view/review-row';

const mockReviews = [
  {
    id: 201,
    customerName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: 'June 12, 2026',
    rating: 5,
    productTitle: 'Minimalist Leather Sneakers',
    title: 'Incredible Material Profile',
    comment: 'Phenomenal material quality! The custom leather finish fits exactly as promised. Shipped quickly too.',
    reply: null
  },
  {
    id: 202,
    customerName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: 'May 28, 2026',
    rating: 2,
    productTitle: 'Classic Canvas Tote',
    title: 'Sizing discrepancy',
    comment: 'The stitch profile is robust but it came smaller than the dimensions illustrated on the configuration menu.',
    reply: 'Hello Alex, sorry to hear about the layout variance. Please contact support so we can send a replacement!'
  }
];

export default function ReviewsPage() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const handleReportAction = (id) => {
    alert(`Review #${id} flagged for content moderation review.`);
  };

  const filteredReviews = mockReviews.filter(rev => {
    const matchesSearch = rev.comment.toLowerCase().includes(search.toLowerCase()) || 
                          rev.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === 'all' ? true : rev.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  return (
    /* Constrained height layout to integrate seamlessly inside your SellerLayout dimensions */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6">
      
      {/* 1. Header Metadata Section */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reviews & Moderation</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage customer sentiment, product ratings, and feedback lines.</p>
        </div>
      </div>

      {/* 2. Aggregate Analytics Metrics Grid */}
      <ReviewAnalytics />

      {/* 3. Operational Toolbar (Filter / Search) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
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

      {/* 4. Independent Scrollable Reviews Feed List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewRow 
              key={review.id} 
              review={review} 
              onReport={handleReportAction} 
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
            No active customer reviews match your filter parameters.
          </div>
        )}
      </div>

    </div>
  );
}