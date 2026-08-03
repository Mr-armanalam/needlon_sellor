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
                            placeholder="14"
                            value={formData.boutiqueStockCount}
                            onChange={(e) => handleInputChange('boutiqueStockCount', e.target.value)}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
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
                        placeholder="NDLN-ETH-KUR-01"
                        value={formData.uniqueSku}
                        onChange={(e) => handleInputChange('uniqueSku', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-mono"
                    />
                </div>

            </div>
        </div>

    );
};

export default InventryLevelNode;