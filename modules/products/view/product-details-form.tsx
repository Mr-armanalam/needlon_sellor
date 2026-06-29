import React, { useState } from 'react';
import { ChevronDown, Sparkles, LayoutGrid, Type, CircleDollarSign, Compass } from 'lucide-react';

export default function ProductDetailsForm() {
  // Track open states for our thematic metadata accordions
  const [sections, setSections] = useState({
    identity: true,
    attributes: true,
    pricing: true,
    logistics: false
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 animate-fade-in">
      
      {/* SECTION 1: IDENTITY & TEXT COMPOSITION */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('identity')}
          className="w-full p-5 flex items-center justify-between bg-neutral-50/40 border-b border-neutral-100/60 outline-none group"
        >
          <div className="flex items-center gap-3 text-neutral-500 group-hover:text-neutral-900 transition-colors">
            <Type size={16} />
            <span className="text-[14px] font-bold tracking-tight uppercase">1. Core Identity</span>
          </div>
          <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${sections.identity ? 'rotate-180' : ''}`} />
        </button>
        
        {sections.identity && (
          <div className="p-6 flex flex-col gap-4 animate-slide-down">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product Title</label>
              <input type="text" placeholder="e.g. Handloom Chikankari Kurti" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
              <textarea rows={3} placeholder="Tell the story of this boutique apparel piece..." className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none" />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: BOUTIQUE ATTRIBUTES MATRIX */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('attributes')}
          className="w-full p-5 flex items-center justify-between bg-neutral-50/40 border-b border-neutral-100/60 outline-none group"
        >
          <div className="flex items-center gap-3 text-neutral-500 group-hover:text-neutral-900 transition-colors">
            <LayoutGrid size={16} />
            <span className="text-[14px] font-bold tracking-tight uppercase">2. Style & Specifications</span>
          </div>
          <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${sections.attributes ? 'rotate-180' : ''}`} />
        </button>

        {sections.attributes && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-slide-down">
            {[
              { label: "Category", placeholder: "Ethnic Wear" },
              { label: "Brand (Optional)", placeholder: "House of Needlon" },
              { label: "Sizes Available", placeholder: "S, M, L, XL" },
              { label: "Colors", placeholder: "Indigo, Ivory" },
              { label: "Fabric", placeholder: "100% Cotton" },
              { label: "Material", placeholder: "Handspun Yarn" },
              { label: "Sleeve Type", placeholder: "Three-Quarter" },
              { label: "Occasion", placeholder: "Festival, Casual" },
              { label: "Gender", placeholder: "Women" }
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{field.label}</label>
                <input type="text" placeholder={field.placeholder} className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: PRICING & INVENTORY */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('pricing')}
          className="w-full p-5 flex items-center justify-between bg-neutral-50/40 border-b border-neutral-100/60 outline-none group"
        >
          <div className="flex items-center gap-3 text-neutral-500 group-hover:text-neutral-900 transition-colors">
            <CircleDollarSign size={16} />
            <span className="text-[14px] font-bold tracking-tight uppercase">3. Valuation & Stock</span>
          </div>
          <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${sections.pricing ? 'rotate-180' : ''}`} />
        </button>

        {sections.pricing && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-down">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Price (INR)</label>
              <input type="text" placeholder="₹2,450" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Discount (%)</label>
              <input type="text" placeholder="10%" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Stock Count</label>
              <input type="number" placeholder="14" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: LOGISTICS RADIUS */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('logistics')}
          className="w-full p-5 flex items-center justify-between bg-neutral-50/40 border-b border-neutral-100/60 outline-none group"
        >
          <div className="flex items-center gap-3 text-neutral-500 group-hover:text-neutral-900 transition-colors">
            <Compass size={16} />
            <span className="text-[14px] font-bold tracking-tight uppercase">4. Delivery Logistics</span>
          </div>
          <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${sections.logistics ? 'rotate-180' : ''}`} />
        </button>

        {sections.logistics && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-down">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pickup Address</label>
              <input type="text" placeholder="Hub Street Workshop, Block C" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Radius</label>
              <input type="text" placeholder="e.g. Nationwide or Local (25 km)" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}