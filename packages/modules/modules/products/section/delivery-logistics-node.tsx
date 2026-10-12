import React from 'react';
import {DELIVERY_RADIUS_OPTIONS, DELIVERY_WINDOW_OPTIONS} from "@/modules/products/constants";
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";

const DeliveryLogisticsNode = () => {
    const {
        formData,
        handleInputChange,
        pickupHubs,
        shippingPartners
    } = useAddProductWizard();

    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Delivery & Logistics Mapping</h3>
                <p className="text-[13px] text-neutral-400">Set up fulfillment origin, assigned carrier partners, and delivery timelines.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup Hub Selection */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pickup Warehouse Hub</label>
                    {pickupHubs && pickupHubs.length > 0 ? (
                        <select
                            value={formData.pickupHubId || ''}
                            onChange={(e) => {
                                const hubId = e.target.value;
                                const selected = pickupHubs.find((h: any) => (h.id || h.hubName || 'hub-main-pimpri') === hubId);
                                if (selected) {
                                    const addr = [selected.hubName, selected.address, selected.city, selected.pincode].filter(Boolean).join(', ');
                                    handleInputChange('pickupHubId', selected.id || selected.hubName || 'hub-main-pimpri');
                                    handleInputChange('pickupHubAddress', addr);
                                } else {
                                    handleInputChange('pickupHubId', '');
                                }
                            }}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                        >
                            <option value="">Select registered boutique hub...</option>
                            {pickupHubs.map((hub: any) => {
                                const idVal = hub.id || hub.hubName || 'hub-main-pimpri';
                                return (
                                    <option key={idVal} value={idVal}>
                                        {hub.hubName} ({hub.city || 'Primary Hub'})
                                    </option>
                                );
                            })}
                        </select>
                    ) : null}
                    <input
                        type="text"
                        placeholder="e.g. Studio Workshop, Block 4C, Kalyan, Maharashtra"
                        value={formData.pickupHubAddress}
                        onChange={(e) => handleInputChange('pickupHubAddress', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Shipping Partner */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Preferred Shipping Carrier</label>
                    <select
                        value={formData.shippingPartnerId || ''}
                        onChange={(e) => handleInputChange('shippingPartnerId', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        <option value="">Default Seller Courier (Auto-assigned)</option>
                        {shippingPartners && shippingPartners.length > 0 ? (
                            shippingPartners.map((partner: any) => (
                                <option key={partner.id} value={partner.id}>
                                    {partner.name || partner.carrierName} ({partner.serviceType || 'Standard Express'})
                                </option>
                            ))
                        ) : (
                            <>
                                <option value="delhivery">Delhivery Surface & Air</option>
                                <option value="bluedart">Blue Dart Express</option>
                                <option value="dtdc">DTDC Premium</option>
                                <option value="indiapost">India Post Speed Post</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Delivery Zone */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Zone</label>
                    <select
                        value={formData.deliveryZone || 'DOMESTIC'}
                        onChange={(e) => handleInputChange('deliveryZone', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        <option value="LOCAL">Local (Intra-city)</option>
                        <option value="REGIONAL">Regional (State/Zone)</option>
                        <option value="DOMESTIC">Domestic (All India)</option>
                        <option value="INTERNATIONAL">International (Global)</option>
                    </select>
                </div>

                {/* Package Weight */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Package Weight (kg)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.05"
                        placeholder="0.35"
                        value={formData.packageWeight}
                        onChange={(e) => handleInputChange('packageWeight', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-medium"
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
            </div>

            {/* Estimated Delivery Window Dropdown */}
            <div className="flex flex-col gap-1.5">
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

    );
};

export default DeliveryLogisticsNode;