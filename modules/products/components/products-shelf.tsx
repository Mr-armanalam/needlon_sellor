'use client';

import React, { useState } from 'react';
import { Plus, ChevronDown, Search, ArrowUpDown, Layers } from 'lucide-react';
import { useProducts } from '../hooks';
import { ProductCard } from './product-card';
import { AddProductWizard } from './add-product-wizard';

export function ProductsShelf() {
  const [viewMode, setViewMode] = useState<'shelf' | 'wizard'>('shelf');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { products, refetch, removeProduct, duplicateProduct } = useProducts(activeTab, searchQuery);

  const handleWizardSuccess = async () => {
    await refetch();
    setViewMode('shelf');
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] font-sans select-none tracking-tight">
      {viewMode === 'shelf' ? (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
          
          {/* Header & Bulk Upload Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight">Products Shelf</h2>
              <p className="text-[13px] text-neutral-400">Organize, track performance, and visually align your showcase boutique items.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-[13px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 rounded-xl transition-all duration-200">
                Bulk Upload
              </button>
              <button 
                onClick={() => setViewMode('wizard')}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm group outline-none"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs, Search & Filters Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-neutral-200/60 pb-2 mt-2">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-neutral-100/70 p-1 rounded-xl max-w-max overflow-x-auto no-scrollbar">
              {['All', 'Active', 'Draft', 'Out of Stock', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg whitespace-nowrap transition-all duration-200 outline-none ${
                    activeTab === tab
                      ? 'bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Smart Sub-Utilities Deck */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Live Search Box */}
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search catalog..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200/80 rounded-xl text-[12px] font-medium text-neutral-800 outline-none focus:border-neutral-400 transition-all shadow-sm"
                />
              </div>

              {/* Filtering & Sorting */}
              <div className="flex items-center gap-2">
                {['Category', 'Size', 'Price Range', 'Stock Status'].map((f) => (
                  <button key={f} className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 outline-none">
                    <span>{f}</span>
                    <ChevronDown size={12} className="text-neutral-400" />
                  </button>
                ))}
                <button className="p-2 bg-white border border-neutral-200/60 text-neutral-500 hover:text-neutral-900 rounded-xl shadow-sm transition-colors">
                  <ArrowUpDown size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Product Empty State Controller */}
          {products.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-neutral-200 rounded-3xl bg-white max-w-xl mx-auto mt-8 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100"><Layers size={20} /></div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-[14px] font-bold text-neutral-800">Your Boutique Shelf is Empty</h4>
                <p className="text-[12px] text-neutral-400 max-w-xs">List your first apparel design product to jumpstart storefront user visibility metrics.</p>
              </div>
              <button onClick={() => setViewMode('wizard')} className="mt-2 px-4 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-xl shadow-sm hover:bg-neutral-800 transition-colors">Create Product</button>
            </div>
          ) : (
            /* PRODUCT BOUTIQUE GRID STAGE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDuplicate={duplicateProduct}
                  onDelete={removeProduct}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <AddProductWizard
          onClose={() => setViewMode('shelf')}
          onSuccess={handleWizardSuccess}
        />
      )}
    </div>
  );
}

export default ProductsShelf;
