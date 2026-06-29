'use client'
import React, { useState } from 'react';
import CustomerList from '../view/customers-list';
import CustomerDetail from '../view/customers-details';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    location: 'New York, USA',
    clv: '$1,420.00',
    totalOrders: 12,
    isRepeat: true,
  });

  const handleMessageTransition = () => {
    // Production note: Add router navigation logic here (e.g., router.push('/messages'))
    alert(`Navigating to chat stream with ${selectedCustomer.name}`);
  };

  return (
    /* Strictly sized to subtract the TopHeader layer perfectly without breaking view overflows */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden font-sans antialiased p-4 bg-slate-50">
      <div className="flex flex-1 w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-0">
        
        {/* Left Side: Directory Search Menu Rail */}
        <CustomerList 
          activeId={selectedCustomer?.id} 
          onSelectCustomer={setSelectedCustomer} 
        />

        {/* Right Side: Segment Data Breakdown Stream */}
        <CustomerDetail 
          customer={selectedCustomer} 
          onOpenChat={handleMessageTransition}
        />

      </div>
    </div>
  );
}