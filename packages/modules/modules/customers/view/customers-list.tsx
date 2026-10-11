'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Award, UserPlus } from 'lucide-react';
import { useCustomers } from '@/modules/customers/hooks/use-customers';
import { deduplicateCustomers } from '../utils/customer-utils';
import AddWalkInModal from '../components/add-walk-in-modal';

export interface CustomerListProps {
  onSelectCustomer: (cust: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    clv: string;
    totalOrders: number;
    isRepeat: boolean;
    isWalkIn?: boolean;
  }) => void;
  activeId?: string;
}

export default function CustomerList({ onSelectCustomer, activeId }: CustomerListProps) {
  const [filterRepeat, setFilterRepeat] = useState(false);
  const [search, setSearch] = useState('');
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const { customers, loading, refetch } = useCustomers(search);

  const displayCustomers = customers.map((c) => ({
    id: c.buyerId,
    name: c.buyerName,
    avatar: c.buyerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.buyerName)}&background=f1f5f9&color=475569`,
    location: c.buyerEmail || 'Customer',
    clv: `₹${c.totalSpent}`,
    totalOrders: c.totalOrders,
    isRepeat: c.totalOrders > 1,
    isWalkIn: !!c.isWalkIn,
  }));

  const filteredCustomers = deduplicateCustomers(
    displayCustomers.filter(customer => {
      const matchesFilter = filterRepeat ? customer.isRepeat : true;
      return matchesFilter;
    })
  );

  useEffect(() => {
    if (!activeId && filteredCustomers.length > 0) {
      onSelectCustomer(filteredCustomers[0]);
    }
  }, [activeId, filteredCustomers, onSelectCustomer]);

  const handleCustomerCreated = (newCust: any) => {
    refetch();
    onSelectCustomer({
      id: newCust.userId,
      name: newCust.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newCust.name)}&background=f1f5f9&color=475569`,
      location: newCust.email,
      clv: '₹0.00',
      totalOrders: 0,
      isRepeat: false,
      isWalkIn: true,
    });
  };

  return (
    <div className="w-full md:w-85 h-full border-r border-gray-200 bg-white flex flex-col min-w-0 flex-shrink-0">
      {/* Header section */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Customers</h1>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsWalkInOpen(true)}
              className="p-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-xs"
              title="Add Walk-in Customer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Walk-in</span>
            </button>
            <button 
              onClick={() => setFilterRepeat(!filterRepeat)}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                filterRepeat 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filterRepeat ? 'Repeat' : 'Filter'}
            </button>
          </div>
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
          filteredCustomers.map((customer, index) => (
            <button
              key={customer.id ? `${customer.id}-${index}` : index}
              onClick={() => onSelectCustomer(customer)}
              className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                activeId === customer.id ? 'bg-blue-50/50 hover:bg-blue-50/50' : ''
              }`}
            >
              <img src={customer.avatar} alt="" className="w-11 h-11 rounded-full object-cover bg-gray-100 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h2 className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1.5">
                    {customer.name}
                    {customer?.isWalkIn && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Walk-in
                      </span>
                    )}
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

      {/* Walk-in Intake Modal */}
      <AddWalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  );
}