'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Award } from 'lucide-react';
import { useCustomers } from '@/modules/customers/hooks/use-customers';

export interface CustomerListProps {
  onSelectCustomer: (cust: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    clv: string;
    totalOrders: number;
    isRepeat: boolean;
  }) => void;
  activeId?: string;
}

export default function CustomerList({ onSelectCustomer, activeId }: CustomerListProps) {
  const [filterRepeat, setFilterRepeat] = useState(false);
  const [search, setSearch] = useState('');
  const { customers, loading } = useCustomers(search);

  const displayCustomers = customers.map((c) => ({
    id: c.buyerId,
    name: c.buyerName,
    avatar: c.buyerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.buyerName)}&background=f1f5f9&color=475569`,
    location: c.buyerEmail || 'Customer',
    clv: `₹${c.totalSpent}`,
    totalOrders: c.totalOrders,
    isRepeat: c.totalOrders > 1,
  }));

  const filteredCustomers = displayCustomers.filter(customer => {
    const matchesFilter = filterRepeat ? customer.isRepeat : true;
    return matchesFilter;
  });

  useEffect(() => {
    if (!activeId && filteredCustomers.length > 0) {
      onSelectCustomer(filteredCustomers[0]);
    }
  }, [activeId, filteredCustomers, onSelectCustomer]);

  return (
    <div className="w-full md:w-85 h-full border-r border-gray-200 bg-white flex flex-col min-w-0 flex-shrink-0">
      {/* Header section */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Customers</h1>
          <button 
            onClick={() => setFilterRepeat(!filterRepeat)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              filterRepeat 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {filterRepeat ? 'Repeat Only' : 'Filter'}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search custom records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Interactive Card Stream Grid */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 min-h-0">
        {loading ? (
          <div className="p-4 text-xs text-neutral-400 text-center">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">No customers found</div>
        ) : (
          filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                activeId === customer.id ? 'bg-blue-50/50 hover:bg-blue-50/50' : ''
              }`}
            >
              <img src={customer.avatar} alt="" className="w-11 h-11 rounded-full object-cover bg-gray-100 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h2 className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                    {customer.name}
                    {customer.isRepeat && (
                      <span title="Repeat Buyer">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    )}
                  </h2>
                  <span className="text-xs font-bold text-gray-900">{customer.clv}</span>
                </div>
                
                <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-0.5 truncate"><MapPin className="w-3 h-3 flex-shrink-0" /> {customer.location}</span>
                  <span className="whitespace-nowrap">{customer.totalOrders} orders</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}