'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerList from '../view/customers-list';
import CustomerDetail from '../view/customers-details';

export default function CustomersPage() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const handleMessageTransition = () => {
    if (!selectedCustomer) return;
    router.push(`/messages?buyerId=${selectedCustomer.id}`);
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