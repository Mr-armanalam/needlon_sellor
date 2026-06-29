import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Award } from 'lucide-react';

const mockCustomers = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    location: 'New York, USA',
    clv: '$1,420.00',
    totalOrders: 12,
    isRepeat: true,
  },
  {
    id: 2,
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    location: 'London, UK',
    clv: '$340.00',
    totalOrders: 3,
    isRepeat: false,
  }
];

export default function CustomerList({ onSelectCustomer, activeId }) {
  const [filterRepeat, setFilterRepeat] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterRepeat ? customer.isRepeat : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full md:w-85 h-full border-r border-gray-200 bg-white flex flex-col min-w-0 flex-shrink-0">
      {/* Header section */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Customers</h1>
          <button 
            onClick={() => setFilterRepeat(!filterRepeat)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
              filterRepeat 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {filterRepeat ? 'Repeat Customers Only' : 'Filter'}
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
        {filteredCustomers.map((customer) => (
          <button
            key={customer.id}
            onClick={() => onSelectCustomer(customer)}
            className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
              activeId === customer.id ? 'bg-blue-50/50 hover:bg-blue-50/50' : ''
            }`}
          >
            <img src={customer.avatar} alt="" className="w-11 h-11 rounded-full object-cover bg-gray-100 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h2 className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                  {customer.name}
                  {customer.isRepeat && (
                    <Award className="w-3.5 h-3.5 text-amber-500" title="Repeat Buyer" />
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
        ))}
      </div>
    </div>
  );
}