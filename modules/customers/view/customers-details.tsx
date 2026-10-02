'use client';
import React from 'react';
import { MapPin, MessageSquare, Star, ShoppingBag, Calendar } from 'lucide-react';
import { useCustomerDetails } from '../hooks/use-customer-details';

export interface CustomerDetailProps {
  customer: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    clv: string;
    totalOrders: number;
    isRepeat: boolean;
  } | null;
  onOpenChat: () => void;
}

export default function CustomerDetail({ customer, onOpenChat }: CustomerDetailProps) {
  const { data, loading } = useCustomerDetails(customer?.id);

  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-sm text-gray-400">
        Select a customer record to view activity timeline.
      </div>
    );
  }

  const history = data.history;
  const reviews = data.reviews;

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
          className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 self-start sm:self-center cursor-pointer"
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

        {/* Reviews Left by User */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Reviews & Feedback</h3>
          {loading ? (
            <div className="p-4 text-xs text-neutral-400 text-center">Loading customer feedback...</div>
          ) : reviews.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              No reviews submitted by this customer yet.
            </div>
          ) : (
            reviews.map((rev) => (
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
            ))
          )}
        </div>

        {/* Order Log History Ledger */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Order Log</h3>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 text-xs text-neutral-400 text-center">Loading order history...</div>
            ) : history.length === 0 ? (
              <div className="p-4 text-xs text-gray-400 text-center">
                No recent order history found for this customer.
              </div>
            ) : (
              history.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {order.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-gray-900">{order.total}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      order.status === 'DELIVERED' || order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}