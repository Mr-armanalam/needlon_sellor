import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";

const PricingSystemNode = () => {
    const {
        formData,
        handleInputChange,
        handlePriceChange,
        handleDiscountChange,
        handleComparePriceChange
    } = useAddProductWizard();

    const retail = parseFloat(formData.retailPrice || '0');
    const cost = parseFloat(formData.costPrice || '0');
    const margin = retail > 0 && cost > 0 ? (((retail - cost) / retail) * 100).toFixed(1) : null;

    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Pricing & Valuation</h3>
                <p className="text-[13px] text-neutral-400">Establish base pricing, promotional discount windows, and tax compliance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Currency */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Currency</label>
                    <select
                        value={formData.currencyCode || 'INR'}
                        onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>

                {/* Retail Price */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Selling / Retail Price</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="2450.00"
                        value={formData.retailPrice}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Compare At Price (MRP) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Compare At Price (MRP)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="2999.00"
                        value={formData.compareAtPrice}
                        onChange={(e) => handleComparePriceChange(e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Discount Rate */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Discount Rate (%)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="10.00"
                        value={formData.discountOfferRate}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Cost Price */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Cost Price (COGS)</label>
                        {margin && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {margin}% Margin
                            </span>
                        )}
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="1400.00"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange('costPrice', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Minimum Advertised Price (MAP) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Min Advertised Price (MAP)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="2200.00"
                        value={formData.minimumAdvertisedPrice}
                        onChange={(e) => handleInputChange('minimumAdvertisedPrice', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Effective From */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Promotional Start Date</label>
                    <input
                        type="date"
                        value={formData.effectiveFrom}
                        onChange={(e) => handleInputChange('effectiveFrom', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Effective Until */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Promotional Expiry Date</label>
                    <input
                        type="date"
                        value={formData.effectiveUntil}
                        onChange={(e) => handleInputChange('effectiveUntil', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>
            </div>

            {/* Tax Inclusive Checkbox */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200/60 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-neutral-900">Tax Inclusive Pricing (GST)</span>
                    <span className="text-[11px] text-neutral-400">Retail price listed includes applicable taxes and GST duties</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isTaxInclusive !== false}
                        onChange={(e) => handleInputChange('isTaxInclusive', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
            </div>
        </div>

    );
};

export default PricingSystemNode;