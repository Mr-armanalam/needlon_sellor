import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";

const PricingSystemNode = () => {
    const {formData, handleInputChange} = useAddProductWizard()
    return (
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

    );
};

export default PricingSystemNode;