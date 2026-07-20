'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Upload, Check, ArrowRight, ChevronLeft, Image } from 'lucide-react';
import { createProductClient } from '../api/product-client';

interface AddProductWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

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
  uniqueSku: `NDLN-CH-KRT-${Math.floor(10 + Math.random() * 90)}`,
  pickupHubAddress: 'Studio Workshop, Block 4C, Kalyan, Maharashtra',
  packageWeight: '0.35',
  deliveryRadiusRange: 'Nationwide Shipping',
  estimatedDeliveryWindow: '3 - 5 business days delivery timeline',
  searchKeywords: 'handloom, chikankari, festive kurti, cotton apparel',
  customVisibility: 'PUBLIC' as const,
  mediaUrls: [] as string[],
};

export function AddProductWizard({ onClose, onSuccess }: AddProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

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

      await createProductClient(payload);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* Header Return Navigator */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
        <button 
          onClick={onClose}
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
  );
}
