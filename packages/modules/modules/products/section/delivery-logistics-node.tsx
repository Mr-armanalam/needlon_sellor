import React from 'react';
import {DELIVERY_RADIUS_OPTIONS, DELIVERY_WINDOW_OPTIONS} from "@/modules/products/constants";
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";

const DeliveryLogisticsNode = () => {
    const {formData, handleInputChange} = useAddProductWizard()
    return (
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

                {/* Delivery Radius Range Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Radius Range</label>
                    <select
                        value={formData.deliveryRadiusRange}
                        onChange={(e) => handleInputChange('deliveryRadiusRange', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {DELIVERY_RADIUS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* Estimated Delivery Window Dropdown */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Delivery Window</label>
                    <select
                        value={formData.estimatedDeliveryWindow}
                        onChange={(e) => handleInputChange('estimatedDeliveryWindow', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {DELIVERY_WINDOW_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>
            </div>
        </div>

    );
};

export default DeliveryLogisticsNode;