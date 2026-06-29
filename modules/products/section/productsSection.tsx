'use client'
// import React, { useState } from 'react';
// import { ArrowLeft, Sparkles, Eye } from 'lucide-react';
// import ProductsCanvas from '../view/products-canvas';
// import AddProductWizard from '../view/add-product-wizard';
// // import ProductDetailsForm from '../view/product-details-form';

import React, { useState } from 'react';
import { 
  Plus, SlidersHorizontal, Eye, Heart, ShoppingBag, Edit3, Share2, Copy, 
  Trash2, ChevronDown, ArrowLeft, Sparkles, Upload, Check, ArrowRight, 
  ChevronLeft, Star, Search, ArrowUpDown, Layers, Info, Image, HelpCircle 
} from 'lucide-react';

// Mock initial data matching boutique requirements
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Handloom Chikankari Kurti",
    category: "Ethnic Wear",
    subcategory: "Kurtis",
    price: "₹2,450",
    discount: "10% OFF",
    stock: 14,
    views: 520,
    likes: 84,
    orders: 32,
    rating: 4.8,
    status: "Active",
    bg: "bg-orange-50 text-orange-700",
    initials: "CK"
  },
  {
    id: 2,
    name: "Pure Cotton Indigo Shirt",
    category: "Western Wear",
    subcategory: "Casual Shirts",
    price: "₹1,850",
    discount: "5% OFF",
    stock: 0,
    views: 340,
    likes: 41,
    orders: 18,
    rating: 4.5,
    status: "Out of Stock",
    bg: "bg-blue-50 text-blue-700",
    initials: "IS"
  }
];

export default function ProductManagement() {
  const [viewMode, setViewMode] = useState<'shelf' | 'wizard'>('shelf');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Wizard Steps (Fully matches your exact 8-step blueprint)
  const wizardSteps = [
    { number: 1, label: "Photos" },
    { number: 2, label: "Basic Info" },
    { number: 3, label: "Pricing" },
    { number: 4, label: "Variants" },
    { number: 5, label: "Inventory" },
    { number: 6, label: "Delivery" },
    { number: 7, label: "SEO & Tags" },
    { number: 8, label: "Preview" }
  ];

  const handleNextStep = () => { if (currentStep < wizardSteps.length) setCurrentStep(prev => prev + 1); };
  const handleBackStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicate = (product: typeof INITIAL_PRODUCTS[0]) => {
    setProducts(prev => [...prev, { ...product, id: Date.now(), name: `${product.name} (Copy)` }]);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] font-sans select-none tracking-tight">
      
      {/* ──────────────────────────────────────────────────────────────
          VIEW 1: BOUTIQUE SHELF (Main Catalog Grid View)
          ────────────────────────────────────────────────────────────── */}
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
                onClick={() => { setViewMode('wizard'); setCurrentStep(1); }}
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
              {/* Lightweight Live Search Box */}
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

              {/* Filtering & Sorting Pop-drawers */}
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
                <div key={product.id} className="group relative bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.03)] animate-fade-in">
                  
                  {/* Aspect Square Image Canvas Box */}
                  <div className="relative w-full aspect-square rounded-xl bg-neutral-50 border border-neutral-100/70 overflow-hidden flex items-center justify-center select-none">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-[22px] font-bold shadow-inner transition-transform duration-500 group-hover:scale-105 ${product.bg}`}>
                      {product.initials}
                    </div>

                    {/* Left Float: Active Status Ticker */}
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
                      product.status === 'Out of Stock' ? 'bg-red-50 text-red-600' : 'bg-white text-neutral-800'
                    }`}>
                      {product.status}
                    </span>

                    {/* Right Float: Interactive Star Rating Row */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-1 text-[11px] font-bold text-neutral-800">
                      <Star size={10} className="fill-amber-400 stroke-amber-400" />
                      <span>{product.rating}</span>
                    </div>

                    {/* Premium Backdrop Hover Tool Drawer */}
                    <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <button title="Edit Product" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Edit3 size={14} /></button>
                      <button onClick={() => handleDuplicate(product)} title="Duplicate Product" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Copy size={14} /></button>
                      <button title="Share Showcase Link" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Share2 size={14} /></button>
                      <button onClick={() => handleDelete(product.id)} title="Delete Product" className="p-2.5 bg-white text-red-500 hover:text-red-600 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  {/* Core Contextual Meta Text Details */}
                  <div className="flex flex-col gap-0.5 px-0.5">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{product.category} • {product.subcategory}</span>
                    <h4 className="text-[14px] font-semibold text-neutral-800 tracking-tight group-hover:text-neutral-900 transition-colors line-clamp-1 mt-0.5">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[15px] font-bold text-neutral-900">{product.price}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{product.discount}</span>
                    </div>
                    <span className={`text-[11px] font-medium mt-1.5 ${product.stock === 0 ? 'text-red-500 font-semibold' : 'text-neutral-400'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} pieces left in boutique`}
                    </span>
                  </div>

                  {/* Integrated Micro-Analytics Footer Ticker */}
                  <div className="grid grid-cols-3 gap-1 border-t border-neutral-100 pt-3 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center"><Eye size={13} /><span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.views}</span><span className="text-[9px] font-medium tracking-tight">Views</span></div>
                    <div className="flex flex-col items-center justify-center"><Heart size={13} /><span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.likes}</span><span className="text-[9px] font-medium tracking-tight">Likes</span></div>
                    <div className="flex flex-col items-center justify-center"><ShoppingBag size={13} /><span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.orders}</span><span className="text-[9px] font-medium tracking-tight">Orders</span></div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────────
            VIEW 2: IMMERSIVE 8-STEP GUIDED WIZARD
            ────────────────────────────────────────────────────────────── */
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
          
          {/* Header Return Navigator */}
          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
            <button 
              onClick={() => setViewMode('shelf')}
              className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group outline-none"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Back to Products Shelf</span>
            </button>

            <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-400 bg-neutral-100/80 px-2.5 py-1 rounded-lg">
              <Sparkles size={12} className="text-neutral-600" />
              <span>Step {currentStep} of 8</span>
            </div>
          </div>

          {/* Stepper Node Progress Tracker */}
          <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-1">
              {wizardSteps.map((step, idx) => (
                <div key={step.number} className="flex items-center gap-2 shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                    currentStep >= step.number ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {currentStep > step.number ? <Check size={10} strokeWidth={3} /> : step.number}
                  </div>
                  <span className={`text-[12px] font-semibold tracking-tight ${
                    currentStep === step.number ? 'text-neutral-900' : 'text-neutral-400'
                  }`}>
                    {step.label}
                  </span>
                  {idx !== wizardSteps.length - 1 && <span className="text-neutral-200 text-[11px] mx-0.5">/</span>}
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentStep - 1) / (wizardSteps.length - 1)) * 100}%` }} />
            </div>
          </div>

          {/* Active Container Panel Stage Area */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] min-h-[380px] flex flex-col justify-between gap-8">
            
            <div className="w-full">
              {/* STEP 1: UPLOAD PHOTOS & VIDEOS */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Upload Media Assets</h3>
                    <p className="text-[13px] text-neutral-400">Add up to 5 clear showcase photos and high-definition video loops of your fabric item.</p>
                  </div>
                  <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50/40 rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group">
                    <div className="p-3 rounded-xl bg-white text-neutral-400 group-hover:text-neutral-900 shadow-sm transition-transform group-hover:scale-105"><Upload size={20} /></div>
                    <span className="text-[13px] font-semibold text-neutral-800">Drag files or click to map folder location</span>
                    <span className="text-[11px] text-neutral-400">Supports JPEG, PNG, MP4 (Max 1080p profile)</span>
                  </div>
                </div>
              )}

              {/* STEP 2: BASIC INFORMATION */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Basic Information</h3>
                    <p className="text-[13px] text-neutral-400">Define your custom piece title, detailed taxonomy categories, and target fit profiles.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label><input type="text" placeholder="e.g. Handloom Chikankari Kurti" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Brand Label</label><input type="text" placeholder="House of Needlon" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category</label><input type="text" placeholder="Ethnic Wear" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Subcategory</label><input type="text" placeholder="Kurtis" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col sm:col-span-2 flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description Story</label><textarea rows={2} placeholder="Write about the weave type, artisan background, and tailoring elements..." className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none" /></div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING SYSTEM */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Pricing Valuation</h3>
                    <p className="text-[13px] text-neutral-400">Establish base metrics and promotional discount windows.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Retail Price (INR)</label>
                      <input type="text" placeholder="₹2,450" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Discount Offer Rate (%)</label>
                      <input type="text" placeholder="10%" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: VARIANTS MATRIX */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Boutique Sizing & Variants</h3>
                    <p className="text-[13px] text-neutral-400">Map out the complete spectrum of available sizes, colors, and specific fit metrics.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sizes Matrix</label><input type="text" placeholder="S, M, L, XL, XXL" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Colors Track</label><input type="text" placeholder="Ivory White, Indigo Blue" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fabric Material</label><input type="text" placeholder="100% Chanderi Cotton" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sleeves Style</label><input type="text" placeholder="Three-Quarter Sleeve" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fit Type</label><input type="text" placeholder="Straight Regular Fit" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Occasion Focus</label><input type="text" placeholder="Festival, Office Wear" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Gender Profile</label><input type="text" placeholder="Women" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col sm:col-span-2 flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Target Age Group</label><input type="text" placeholder="Adults (18-45 Years)" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                  </div>
                </div>
              )}

              {/* STEP 5: INVENTORY LEVEL */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Inventory & Allocation</h3>
                    <p className="text-[13px] text-neutral-400">Set total stock quantities and register stock keeping unit codes.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Boutique Stock Count</label><input type="number" placeholder="14" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Unique SKU Reference Code</label><input type="text" placeholder="NDLN-CH-KRT-01" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                  </div>
                </div>
              )}

              {/* STEP 6: DELIVERY LOGISTICS */}
              {currentStep === 6 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Delivery Logistics Mapping</h3>
                    <p className="text-[13px] text-neutral-400">Set up the origin warehouse coordinate details and shipping radius variables.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pickup Hub Address</label><input type="text" placeholder="Studio Workshop, Block 4C, Kalyan, Maharashtra" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Package Weight (kg)</label><input type="text" placeholder="0.35 kg" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Radius Range</label><input type="text" placeholder="Nationwide Shipping" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Delivery Window</label><input type="text" placeholder="3 - 5 business days delivery timeline" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                  </div>
                </div>
              )}

              {/* STEP 7: SEO & TAGS (OPTIONAL) */}
              {currentStep === 7 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">SEO optimization & Search Tags <span className="text-[12px] text-neutral-400 font-normal ml-1">(Optional)</span></h3>
                    <p className="text-[13px] text-neutral-400">Add meta text identifier keywords to increase discoverability on Google search indices.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Search Keywords / Tags</label><input type="text" placeholder="e.g. handloom, chikankari, festive kurti, cotton apparel" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Custom Visibility Settings</label><input type="text" placeholder="Public (Visible to everyone on index shelves)" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
                  </div>
                </div>
              )}

              {/* STEP 8: PREVIEW & PUBLISH */}
              {currentStep === 8 && (
                <div className="flex flex-col gap-5 items-center justify-center text-center py-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md animate-bounce"><Image size={22} /></div>
                  <div className="flex flex-col gap-1 max-w-sm">
                    <h3 className="text-[16px] font-bold text-neutral-900">Your Shelf Item Looks Perfect!</h3>
                    <p className="text-[13px] text-neutral-400">Everything is complete. Choose to lock it as a silent Draft or Publish it directly to your live public catalog.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Wizard Interactive Action Base Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <button 
                onClick={handleBackStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors outline-none ${
                  currentStep === 1 ? 'text-neutral-300 pointer-events-none' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                {currentStep === wizardSteps.length && (
                  <button 
                    onClick={() => setViewMode('shelf')}
                    className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-[13px] font-semibold rounded-xl transition-all"
                  >
                    Save Draft
                  </button>
                )}
                
                <button 
                  onClick={currentStep === wizardSteps.length ? () => setViewMode('shelf') : handleNextStep}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none shadow-sm group"
                >
                  <span>{currentStep === wizardSteps.length ? 'Publish Product' : 'Continue'}</span>
                  {currentStep === wizardSteps.length ? (
                    <Sparkles size={14} />
                  ) : (
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// export default function ProductsPage() {
//   const [viewMode, setViewMode] = useState<'canvas' | 'create'>('canvas');

//   return (
//     <div className="w-full min-h-full bg-[#FAFAFA]">
//       {viewMode === 'canvas' ? (
//         <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
//           <div onClick={(e) => {
//             const target = e.target as HTMLElement;
//             if (target.closest('button')?.textContent?.includes('Add Product')) {
//               setViewMode('create');
//             }
//           }}>
//             <ProductsCanvas />
//           </div>
//         </div>
//       ) : (
//         /* The UI is now perfectly optimized because the step views live strictly inside the Wizard bounding box */
//         <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
//           <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
//             <button onClick={() => setViewMode('canvas')} className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group outline-none">
//               <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
//               <span>Back to Products Shelf</span>
//             </button>
//             <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-400 bg-neutral-100/80 px-2.5 py-1 rounded-lg">
//               <Sparkles size={12} className="text-neutral-600" />
//               <span>Boutique Creation Suite</span>
//             </div>
//           </div>

//           <section className="w-full">
//             <AddProductWizard />
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }

