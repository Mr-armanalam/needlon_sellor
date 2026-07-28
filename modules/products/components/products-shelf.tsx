'use client';

import React, { useState } from 'react';
import { Plus, ChevronDown, Search, ArrowUpDown, Layers, Loader2 } from 'lucide-react';
import { useProducts } from '../hooks';
import { ProductCard } from './product-card';
import { AddProductWizard } from './add-product-wizard';
import { BulkUploadModal } from './bulk-upload-modal';
import { createDraftProductClient } from '../api/product-client';

export function ProductsShelf() {
  const [viewMode, setViewMode] = useState<'shelf' | 'wizard'>('shelf');
  const [draftProductId, setDraftProductId] = useState<string | null>(null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Category');
  const [size, setSize] = useState('Size');
  const [priceRange, setPriceRange] = useState('Price Range');
  const [stockStatus, setStockStatus] = useState('Stock Status');
  const [sortOrder, setSortOrder] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { products, refetch, removeProduct, duplicateProduct } = useProducts(
    activeTab,
    searchQuery,
    category,
    size,
    priceRange,
    stockStatus,
    sortOrder
  );

  const handleToggleSort = () => {
    if (sortOrder === 'newest') setSortOrder('price_asc');
    else if (sortOrder === 'price_asc') setSortOrder('price_desc');
    else setSortOrder('newest');
  };

  const handleStartWizard = async () => {
    try {
      setIsCreatingDraft(true);
      const res = await createDraftProductClient();
      const newProductId = res?.data?.id || res?.id;
      setDraftProductId(newProductId || null);
      setViewMode('wizard');
    } catch (err) {
      console.error("Failed to initialize draft product API:", err);
      setViewMode('wizard');
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const handleWizardSuccess = async () => {
    setDraftProductId(null);
    await refetch();
    setViewMode('shelf');
  };

  const handleEditProduct = (id: string) => {
    setDraftProductId(id);
    setViewMode('wizard');
  };

  const handleShareProduct = (product: any) => {
    const link = `${window.location.origin}/products/${product.slug}`;
    navigator.clipboard.writeText(link)
      .then(() => alert(`Share link copied: ${link}`))
      .catch((err) => console.error("Could not copy link:", err));
  };

  const handleBulkUploadClick = () => {
    setIsBulkModalOpen(true);
  };

  const handleBulkUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        let items = [];
        if (file.name.endsWith(".json")) {
          items = JSON.parse(text);
        } else {
          const lines = text.split("\n").filter(l => l.trim() !== "");
          const headers = lines[0].split(",").map(h => h.trim());
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map(c => c.trim());
            const row: any = {};
            headers.forEach((h, idx) => {
              row[h] = cols[idx] || "";
            });
            items.push(row);
          }
        }

        const { bulkUploadProductsClient } = await import("../api/product-client");
        await bulkUploadProductsClient(items);
        alert(`Successfully imported ${items.length} products!`);
        await refetch();
      } catch (err: any) {
        alert("Failed to parse/upload bulk file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#FAFAFA] font-sans select-none tracking-tight">
      {viewMode === 'shelf' ? (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleBulkUploadFile}
            accept=".json,.csv"
            className="hidden"
          />

          {/* Header & Bulk Upload Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight">Products Shelf</h2>
              <p className="text-[13px] text-neutral-400">Organize, track performance, and visually align your showcase boutique items.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkUploadClick}
                className="px-4 py-2 text-[13px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 rounded-xl transition-all duration-200"
              >
                Bulk Upload
              </button>
              <button 
                onClick={handleStartWizard}
                disabled={isCreatingDraft}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm group outline-none disabled:opacity-75"
              >
                {isCreatingDraft ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={2.5} />}
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
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                >
                  <option value="Category">Category</option>
                  <option value="Ethnic Wear">Ethnic Wear</option>
                  <option value="Western Wear">Western Wear</option>
                  <option value="Dupattas">Dupattas</option>
                </select>

                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                >
                  <option value="Size">Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="Free Size">Free Size</option>
                </select>

                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                >
                  <option value="Price Range">Price Range</option>
                  <option value="under_1000">Under ₹1,000</option>
                  <option value="1000_3000">₹1,000 - ₹3,000</option>
                  <option value="above_3000">Above ₹3,000</option>
                </select>

                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                >
                  <option value="Stock Status">Stock Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                <button 
                  onClick={handleToggleSort} 
                  title={`Sort: ${sortOrder === 'price_asc' ? 'Price: Low to High' : sortOrder === 'price_desc' ? 'Price: High to Low' : 'Newest'}`}
                  className={`p-2 bg-white border border-neutral-200/60 text-neutral-500 hover:text-neutral-900 rounded-xl shadow-sm transition-colors 
                    ${sortOrder !== 'newest' ? 'border-neutral-900 text-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10' : ''}
                    `}
                  
                >
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
              <button onClick={handleStartWizard} disabled={isCreatingDraft} className="mt-2 px-4 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-xl shadow-sm hover:bg-neutral-800 transition-colors disabled:opacity-75">Create Product</button>
            </div>
          ) : (
            /* PRODUCT BOUTIQUE GRID STAGE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDuplicate={duplicateProduct}
                  onDelete={removeProduct}
                  onShare={handleShareProduct}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <AddProductWizard
          productId={draftProductId}
          onClose={() => setViewMode('shelf')}
          onSuccess={handleWizardSuccess}
        />
      )}

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

export default ProductsShelf;
