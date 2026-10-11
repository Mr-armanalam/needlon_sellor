'use client';
import React from 'react';
import { MapPin, MessageSquare, Star, ShoppingBag, Calendar, Scissors, Ruler } from 'lucide-react';
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

        {/* Bespoke Tailoring Measurements & Custom Orders Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-neutral-800" />
              Bespoke Measurements & Tailoring Specs
            </h3>
            {data.measurements && data.measurements.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md">
                {data.measurements.length} Profile{data.measurements.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-4 text-xs text-neutral-400 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              Loading tailoring metrics...
            </div>
          ) : !data.measurements || data.measurements.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              No bespoke measurements recorded for this customer yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.measurements.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                          {m.garmentType.replace(/_/g, " ")} ({m.gender})
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-900 text-white rounded">
                          {m.unit}
                        </span>
                        {m.fitPreference && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            {m.fitPreference} FIT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Source: {m.source === "IN_STORE_TAILOR_MASTER" ? "In-Store Tailor Master" : "Customer Online Intake"} • Recorded: {m.date}
                      </p>
                    </div>
                    {m.orderId && (
                      <span className="text-[11px] font-medium text-neutral-500">
                        Order #{m.orderId.slice(-6)}
                      </span>
                    )}
                  </div>

                  {/* Essential Measurements Grid */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-neutral-500" /> Essential Measurements
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(m.essentialMeasurements || {}).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-2 bg-neutral-50 rounded-lg border border-neutral-100 flex flex-col"
                        >
                          <span className="text-[10px] text-gray-500 capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-bold text-gray-900">
                            {String(val)} {m.unit === "CM" ? "cm" : "in"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Posture & Bespoke Specifics if available */}
                  {m.postureSpecifics && Object.keys(m.postureSpecifics).length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Bespoke & Posture Nuances
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(m.postureSpecifics).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-2 bg-neutral-50/70 rounded-lg border border-neutral-100 flex flex-col"
                          >
                            <span className="text-[10px] text-gray-500 capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs font-semibold text-gray-800">
                              {String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tailor Cutting Notes */}
                  {m.tailorNotes && (
                    <div className="p-2.5 bg-amber-50/60 border border-amber-200/50 rounded-lg text-xs text-amber-900">
                      <span className="font-bold">Tailor Master Instructions: </span>
                      {m.tailorNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
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