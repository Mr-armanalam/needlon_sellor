import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, MessageSquare, ArrowRight, Printer } from 'lucide-react';
import { fetchOrdersClient } from '../api/order-client';

interface OrdersCanvasProps {
  onInspectOrder: (orderId: string) => void;
}

const TAB_MAP: Record<string, string> = {
  'New': 'NEW',
  'Accepted': 'ACCEPTED',
  'Packed': 'PACKED',
  'Ready': 'READY',
  'Out for Delivery': 'OUT_FOR_DELIVERY',
  'Completed': 'COMPLETED',
  'Cancelled': 'CANCELLED',
  'Returned': 'RETURNED',
  'Rejected': 'REJECTED',
};

export default function OrdersCanvas({ onInspectOrder }: OrdersCanvasProps) {
  const [activeTab, setActiveTab] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    NEW: 0,
    ACCEPTED: 0,
    PACKED: 0,
    READY: 0,
    OUT_FOR_DELIVERY: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    RETURNED: 0,
    REJECTED: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const apiStatus = TAB_MAP[activeTab] || 'NEW';
        const response = await fetchOrdersClient(apiStatus, searchQuery);
        if (response.success && response.data) {
          setOrders(response.data.items || []);
          setCounts(response.data.counts || {});
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadOrders();
    }, 300); // debounce input

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  // Fulfillment Pipeline statuses
  const orderTabs = [
    { label: 'New', count: counts.NEW || null },
    { label: 'Accepted', count: counts.ACCEPTED || null },
    { label: 'Packed', count: counts.PACKED || null },
    { label: 'Ready', count: counts.READY || null },
    { label: 'Out for Delivery', count: counts.OUT_FOR_DELIVERY || null },
    { label: 'Completed', count: counts.COMPLETED || null },
    { label: 'Cancelled', count: counts.CANCELLED || null },
    { label: 'Returned', count: counts.RETURNED || null },
    { label: 'Rejected', count: counts.REJECTED || null }
  ];

  function getInitials(name: string) {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  }

  function formatItems(itemsList: any[]) {
    if (!itemsList || itemsList.length === 0) return "No items";
    const firstItem = itemsList[0];
    const count = itemsList.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const details = `${firstItem.productName || "Product"}${firstItem.variantName ? ` (${firstItem.variantName})` : ''}`;
    if (itemsList.length === 1) {
      return `${firstItem.quantity}x ${details}`;
    }
    return `${firstItem.quantity}x ${details} + ${count - firstItem.quantity} other items`;
  }

  function formatAmount(amount: string | number) {
    const num = parseFloat(amount.toString()) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* 1. HEADER CONTROL LAYER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight">Orders</h2>
          <p className="text-[13px] text-neutral-400 font-normal">Monitor your pipeline, package items, and track live boutique dispatch states.</p>
        </div>
        
        {/* Quick Bulk Action */}
        <button className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm outline-none">
          <Printer size={15} />
          <span>Print Manifests</span>
        </button>
      </div>

      {/* 2. ORDER STAGES HORIZONTAL TAB TRACK */}
      <div className="flex flex-col gap-4 border-b border-neutral-200/60 pb-2 mt-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {orderTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all duration-200 outline-none shrink-0 ${
                activeTab === tab.label
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                  activeTab === tab.label ? 'bg-white text-neutral-950' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 3. SEARCH & FILTERS ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200/80 rounded-xl text-[12px] font-medium text-neutral-800 outline-none focus:border-neutral-400 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[12px] font-semibold pr-2 border-r border-neutral-200 mr-1 shrink-0">
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </div>
            {['Delivery Mode', 'Value Tier', 'Date Range'].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1.5 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 outline-none shrink-0"
              >
                <span>{filter}</span>
                <ChevronDown size={12} className="text-neutral-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ORDERS QUEUE LIST LAYOUT */}
      <div className="flex flex-col gap-3.5 mt-1 min-h-[150px]">
        {loading ? (
          <div className="w-full py-16 flex items-center justify-center text-[13px] font-semibold text-neutral-400">
            Loading orders pipeline...
          </div>
        ) : error ? (
          <div className="w-full py-16 flex items-center justify-center text-[13px] font-semibold text-red-500">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-[14px] font-bold text-neutral-800">No Orders Found</span>
            <span className="text-[12px] text-neutral-400">There are no orders matching your current criteria.</span>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id}
              className="group bg-white border border-neutral-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.015)]"
            >
              {/* Customer & Description Identity */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-700 border border-neutral-100 flex items-center justify-center font-bold text-[13px] shadow-inner shrink-0">
                  {getInitials(order.buyerName)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-neutral-900 tracking-tight">{order.buyerName}</span>
                    <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100/70 px-1.5 py-0.5 rounded-md">{order.orderNumber}</span>
                    <span className="text-[11px] font-medium text-neutral-400">• {getRelativeTime(order.createdAt)}</span>
                  </div>
                  <span className="text-[13px] text-neutral-500 line-clamp-1 mt-0.5">{formatItems(order.items)}</span>
                </div>
              </div>

              {/* Price & Action Interactive Row */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0 border-neutral-50">
                <div className="flex flex-col md:items-end gap-0.5">
                  <span className="text-[15px] font-bold text-neutral-900">{formatAmount(order.grandTotal)}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded max-w-max uppercase ${
                    order.paymentStatus === 'PAID' ? 'text-emerald-600 bg-emerald-50' :
                    order.paymentStatus === 'PENDING' ? 'text-amber-600 bg-amber-50' : 'text-neutral-500 bg-neutral-100'
                  }`}>
                    {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentMethod}
                  </span>
                </div>

                {/* Action Suite */}
                <div className="flex items-center gap-1.5">
                  <button title="Open Customer Chat" className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-neutral-100 transition-all duration-150">
                    <MessageSquare size={16} />
                  </button>
                  <button onClick={() => onInspectOrder(order.id)} title="View Full Order Timeline" className="pl-3 pr-2.5 py-2 bg-neutral-50 border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent text-neutral-800 text-[12px] font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 outline-none">
                    <span>Inspect Details</span>
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}