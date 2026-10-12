import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {Sparkles} from "lucide-react";

const InventryLevelNode = () => {
    const {handleGenerateSKU, formData, handleInputChange} = useAddProductWizard()
    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Inventory & Allocation</h3>
                <p className="text-[13px] text-neutral-400">Set total stock quantities and register stock keeping unit codes.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Boutique Stock Count</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            placeholder="Enter available quantity (e.g. 14)"
                            value={formData.boutiqueStockCount}
                            onChange={(e) => handleInputChange('boutiqueStockCount', e.target.value)}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-medium"
                        />
                    </div>
                    {/* Stock Shortcuts */}
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-neutral-400 font-medium">Quick preset:</span>
                        {['5', '10', '25', '50'].map(cnt => (
                            <button
                                type="button"
                                key={cnt}
                                onClick={() => handleInputChange('boutiqueStockCount', cnt)}
                                className="px-2 py-0.5 text-[11px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors"
                            >
                                {cnt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Unique SKU Reference Code</label>
                        <button
                            type="button"
                            onClick={handleGenerateSKU}
                            className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 underline flex items-center gap-1 outline-none"
                        >
                            <Sparkles size={11} />
                            <span>Auto-Generate</span>
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="e.g. NDLN-ETH-KUR-01"
                        value={formData.uniqueSku}
                        onChange={(e) => handleInputChange('uniqueSku', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-mono"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Low Stock Threshold</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="Alert threshold (default 5)"
                        value={formData.lowStockThreshold}
                        onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-medium"
                    />
                    <span className="text-[11px] text-neutral-400">Receive an inventory alert when available stock drops below this count.</span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Barcode / EAN / UPC <span className="text-neutral-300 normal-case">(Optional)</span></label>
                    <input
                        type="text"
                        placeholder="e.g. 8901234567890"
                        value={formData.barcode}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-mono"
                    />
                    <span className="text-[11px] text-neutral-400">Barcode or scan identifier for boutique warehouse management.</span>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200/60 rounded-xl mt-1">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold text-neutral-900">Allow Backorders When Out of Stock</span>
                        <span className="text-[11px] text-neutral-400">Allow customers to continue placing boutique orders even when stock count reaches 0.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(formData.allowBackorder)}
                            onChange={(e) => handleInputChange('allowBackorder', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                </div>

            </div>
        </div>

    );
};

export default InventryLevelNode;