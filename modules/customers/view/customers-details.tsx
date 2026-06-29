import React from 'react';
import { MapPin, MessageSquare, Star, ShoppingBag, Calendar, ArrowUpRight } from 'lucide-react';

export default function CustomerDetail({ customer, onOpenChat }) {
  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-sm text-gray-400">
        Select a customer record to view activity timeline.
      </div>
    );
  }

  // Mock Expanded Profile Data Object
  const customerMeta = {
    favorites: [
      { id: 1, title: 'Minimalist Leather Sneakers', price: '$120.00', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150' },
      { id: 2, title: 'Classic Canvas Tote', price: '$45.00', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150' }
    ],
    reviews: [
      { id: 101, rating: 5, comment: 'Phenomenal material quality! The custom leather finish fits exactly as promised.', product: 'Minimalist Leather Sneakers', date: 'June 12, 2026' }
    ],
    history: [
      { id: 'ORD-1024', date: 'June 24, 2026', total: '$120.00', status: 'In Transit' },
      { id: 'ORD-0982', date: 'May 02, 2026', total: '$165.00', status: 'Delivered' }
    ]
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-y-auto min-h-0">
      {/* 1. Profile Core Card Banner */}
      <div className="bg-white border-b border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <img src={customer.avatar} alt="" className="w-16 h-16 rounded-full object-cover bg-gray-50 border border-gray-100" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{customer.name}</h2>
              {customer.isRepeat && (
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">Repeat Buyer</span>
              )}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {customer.location}
            </p>
          </div>
        </div>

        {/* Primary Action Button: Communication Pivot Hook */}
        <button 
          onClick={onOpenChat}
          className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <MessageSquare className="w-4 h-4" /> Message Customer
        </button>
      </div>

      {/* 2. Secondary Data Grid Stream Blocks */}
      <div className="p-6 space-y-6 flex-1 min-h-0">
        
        {/* Core Metric Highlights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Customer Lifetime Value (CLV)</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{customer.clv}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Completed Orders</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{customer.totalOrders} total</p>
          </div>
        </div>

        {/* Favorite Products Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Favorite Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customerMeta.favorites.map((prod) => (
              <div key={prod.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <img src={prod.img} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">{prod.title}</h4>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{prod.price}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><ArrowUpRight className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Left by User */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Reviews & Feedback</h3>
          {customerMeta.reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">{rev.date}</span>
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">"{rev.comment}"</p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Item: <span className="font-medium text-gray-500">{rev.product}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Order Log History Ledger */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Order Log</h3>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {customerMeta.history.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{order.id}</p>
                  <p className="text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {order.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-gray-900">{order.total}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}