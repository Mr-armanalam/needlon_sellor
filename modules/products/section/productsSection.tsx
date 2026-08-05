'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, SlidersHorizontal, Eye, Heart, ShoppingBag, Edit3, Share2, Copy, 
  Trash2, ChevronDown, ArrowLeft, Sparkles, Upload, Check, ArrowRight, 
  ChevronLeft, Star, Search, ArrowUpDown, Layers, Info, Image, HelpCircle 
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Handloom Chikankari Kurti',
    category: 'Ethnic Wear',
    subcategory: 'Kurtis',
    price: '₹2,450',
    discount: '10% OFF',
    stock: 14,
    views: 520,
    likes: 84,
    orders: 32,
    rating: 4.8,
    status: 'Active',
    bg: 'bg-orange-50 text-orange-700',
    initials: 'CK'
  },
  {
    id: '2',
    name: 'Pure Cotton Indigo Shirt',
    category: 'Western Wear',
    subcategory: 'Casual Shirts',
    price: '₹1,850',
    discount: '5% OFF',
    stock: 0,
    views: 340,
    likes: 41,
    orders: 18,
    rating: 4.5,
    status: 'Out of Stock',
    bg: 'bg-blue-50 text-blue-700',
    initials: 'IS'
  }
];

const DEFAULT_FORM_DATA = {
  name: 'Handloom Chikankari Kurti',
  brandLabel: 'House of Needlon',
  category: 'Ethnic Wear',
  subcategory: 'Kurtis',
  descriptionStory: 'Write about the weave type, artisan background, and tailoring elements...',
  retailPrice: '2450',
  discountOfferRate: '10',
  sizesMatrix: 'S, M, L, XL, XXL',
  colorsTrack: 'Ivory White, Indigo Blue',
  fabricMaterial: '100% Chanderi Cotton',
  sleevesStyle: 'Three-Quarter Sleeve',
  fitType: 'Straight Regular Fit',
  occasionFocus: 'Festival, Office Wear',
  genderProfile: 'Women',
  targetAgeGroup: 'Adults (18-45 Years)',
  boutiqueStockCount: '14',
  uniqueSku: 'NDLN-CH-KRT-01',
  pickupHubAddress: 'Studio Workshop, Block 4C, Kalyan, Maharashtra',
  packageWeight: '0.35',
  deliveryRadiusRange: 'Nationwide Shipping',
  estimatedDeliveryWindow: '3 - 5 business days delivery timeline',
  searchKeywords: 'handloom, chikankari, festive kurti, cotton apparel',
  customVisibility: 'PUBLIC' as const,
  mediaUrls: [] as string[],
};

export default function ProductManagement() {
  const [viewMode, setViewMode] = useState<'shelf' | 'wizard'>('shelf');
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // 8-Step Blueprint Stepper
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

  // Fetch real products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'All') params.append('status', activeTab.toUpperCase().replace(' ', '_'));
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/seller/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.items) {
          const mapped = json.data.items.map((item: any) => {
            const primaryVariant = item.variants?.[0];
            const priceVal = primaryVariant?.price ? `₹${Number(primaryVariant.price).toLocaleString()}` : '₹0';
            const stockVal = primaryVariant ? (item.inventory?.quantity ?? 14) : 0;
            const initials = item.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'PD';
            return {
              id: item.id,
              name: item.name,
              category: item.category?.name || 'Apparel',
              subcategory: item.shortDescription || 'Boutique',
              price: priceVal,
              discount: '10% OFF',
              stock: stockVal,
              views: 120,
              likes: 24,
              orders: 8,
              rating: 4.8,
              status: item.status === 'PUBLISHED' ? (stockVal > 0 ? 'Active' : 'Out of Stock') : 'Draft',
              bg: 'bg-orange-50 text-orange-700',
              initials,
            };
          });
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNextStep = () => { if (currentStep < wizardSteps.length) setCurrentStep(prev => prev + 1); };
  const handleBackStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

  const handleInputChange = (field: keyof typeof DEFAULT_FORM_DATA, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async (status: 'DRAFT' | 'PUBLISHED') => {
    try {
      setIsSubmitting(true);
      const sku = formData.uniqueSku.trim() || `NDLN-${Date.now().toString().slice(-6)}`;
      const payload = {
        ...formData,
        uniqueSku: sku,
        status,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchProducts();
        setViewMode('shelf');
        setFormData({
          ...DEFAULT_FORM_DATA,
          uniqueSku: `NDLN-${Date.now().toString().slice(-6)}`,
        });
      } else {
        const errJson = await res.json();
        alert(errJson.error?.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      if (typeof id === 'string' && id.includes('-')) {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleDuplicate = (product: any) => {
    setProducts(prev => [...prev, { ...product, id: `copy-${Date.now()}`, name: `${product.name} (Copy)` }]);
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
                onClick={() => { 
                  setFormData({
                    ...DEFAULT_FORM_DATA,
                    uniqueSku: `NDLN-CH-KRT-${Math.floor(10 + Math.random() * 90)}`,
                  });
                  setViewMode('wizard'); 
                  setCurrentStep(1); 
                }}
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

          {/* Product Loading & Empty State Controller */}
          {isLoading ? (
            /* LOADING SKELETON GRID STAGE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between gap-4 animate-pulse">
                  {/* Aspect Square Placeholder */}
                  <div className="relative w-full aspect-square rounded-xl bg-neutral-100/70 overflow-hidden flex items-center justify-center" />
                  
                  {/* Details Placeholders */}
                  <div className="flex flex-col gap-2 px-0.5 mt-2">
                    <div className="h-3 w-2/3 bg-neutral-100 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-100 rounded mt-1" />
                    <div className="h-4 w-1/3 bg-neutral-100 rounded mt-1" />
                    <div className="h-3 w-1/2 bg-neutral-100 rounded mt-2" />
                  </div>
                  
                  {/* Micro-Analytics Placeholders */}
                  <div className="grid grid-cols-3 gap-1 border-t border-neutral-100 pt-3 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-100" />
                      <div className="h-3 w-6 bg-neutral-100 rounded" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-100" />
                      <div className="h-3 w-6 bg-neutral-100 rounded" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-100" />
                      <div className="h-3 w-6 bg-neutral-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
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
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Handloom Chikankari Kurti" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Brand Label</label>
                      <input 
                        type="text" 
                        placeholder="House of Needlon" 
                        value={formData.brandLabel}
                        onChange={(e) => handleInputChange('brandLabel', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                      <input 
                        type="text" 
                        placeholder="Ethnic Wear" 
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Subcategory</label>
                      <input 
                        type="text" 
                        placeholder="Kurtis" 
                        value={formData.subcategory}
                        onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col sm:col-span-2 flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description Story</label>
                      <textarea 
                        rows={2} 
                        placeholder="Write about the weave type, artisan background, and tailoring elements..." 
                        value={formData.descriptionStory}
                        onChange={(e) => handleInputChange('descriptionStory', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none" 
                      />
                    </div>
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
                      <input 
                        type="text" 
                        placeholder="₹2,450" 
                        value={formData.retailPrice}
                        onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Discount Offer Rate (%)</label>
                      <input 
                        type="text" 
                        placeholder="10%" 
                        value={formData.discountOfferRate}
                        onChange={(e) => handleInputChange('discountOfferRate', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
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
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sizes Matrix</label>
                      <input 
                        type="text" 
                        placeholder="S, M, L, XL, XXL" 
                        value={formData.sizesMatrix}
                        onChange={(e) => handleInputChange('sizesMatrix', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Colors Track</label>
                      <input 
                        type="text" 
                        placeholder="Ivory White, Indigo Blue" 
                        value={formData.colorsTrack}
                        onChange={(e) => handleInputChange('colorsTrack', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fabric Material</label>
                      <input 
                        type="text" 
                        placeholder="100% Chanderi Cotton" 
                        value={formData.fabricMaterial}
                        onChange={(e) => handleInputChange('fabricMaterial', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sleeves Style</label>
                      <input 
                        type="text" 
                        placeholder="Three-Quarter Sleeve" 
                        value={formData.sleevesStyle}
                        onChange={(e) => handleInputChange('sleevesStyle', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fit Type</label>
                      <input 
                        type="text" 
                        placeholder="Straight Regular Fit" 
                        value={formData.fitType}
                        onChange={(e) => handleInputChange('fitType', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Occasion Focus</label>
                      <input 
                        type="text" 
                        placeholder="Festival, Office Wear" 
                        value={formData.occasionFocus}
                        onChange={(e) => handleInputChange('occasionFocus', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Gender Profile</label>
                      <input 
                        type="text" 
                        placeholder="Women" 
                        value={formData.genderProfile}
                        onChange={(e) => handleInputChange('genderProfile', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col sm:col-span-2 flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Target Age Group</label>
                      <input 
                        type="text" 
                        placeholder="Adults (18-45 Years)" 
                        value={formData.targetAgeGroup}
                        onChange={(e) => handleInputChange('targetAgeGroup', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
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
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Boutique Stock Count</label>
                      <input 
                        type="number" 
                        placeholder="14" 
                        value={formData.boutiqueStockCount}
                        onChange={(e) => handleInputChange('boutiqueStockCount', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Unique SKU Reference Code</label>
                      <input 
                        type="text" 
                        placeholder="NDLN-CH-KRT-01" 
                        value={formData.uniqueSku}
                        onChange={(e) => handleInputChange('uniqueSku', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
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
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pickup Hub Address</label>
                      <input 
                        type="text" 
                        placeholder="Studio Workshop, Block 4C, Kalyan, Maharashtra" 
                        value={formData.pickupHubAddress}
                        onChange={(e) => handleInputChange('pickupHubAddress', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Package Weight (kg)</label>
                      <input 
                        type="text" 
                        placeholder="0.35 kg" 
                        value={formData.packageWeight}
                        onChange={(e) => handleInputChange('packageWeight', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Radius Range</label>
                      <input 
                        type="text" 
                        placeholder="Nationwide Shipping" 
                        value={formData.deliveryRadiusRange}
                        onChange={(e) => handleInputChange('deliveryRadiusRange', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Delivery Window</label>
                      <input 
                        type="text" 
                        placeholder="3 - 5 business days delivery timeline" 
                        value={formData.estimatedDeliveryWindow}
                        onChange={(e) => handleInputChange('estimatedDeliveryWindow', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
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
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Search Keywords / Tags</label>
                      <input 
                        type="text" 
                        placeholder="e.g. handloom, chikankari, festive kurti, cotton apparel" 
                        value={formData.searchKeywords}
                        onChange={(e) => handleInputChange('searchKeywords', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Custom Visibility Settings</label>
                      <input 
                        type="text" 
                        placeholder="Public (Visible to everyone on index shelves)" 
                        value={formData.customVisibility}
                        onChange={(e) => handleInputChange('customVisibility', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                      />
                    </div>
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
                disabled={currentStep === 1 || isSubmitting}
                className={`px-4 py-2 text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors outline-none ${
                  currentStep === 1 || isSubmitting ? 'text-neutral-300 pointer-events-none' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                {currentStep === wizardSteps.length && (
                  <button 
                    disabled={isSubmitting}
                    onClick={() => handleSaveProduct('DRAFT')}
                    className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-[13px] font-semibold rounded-xl transition-all outline-none"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Draft'}
                  </button>
                )}
                
                <button 
                  disabled={isSubmitting}
                  onClick={currentStep === wizardSteps.length ? () => handleSaveProduct('PUBLISHED') : handleNextStep}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none shadow-sm group"
                >
                  <span>{currentStep === wizardSteps.length ? (isSubmitting ? 'Publishing...' : 'Publish Product') : 'Continue'}</span>
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
