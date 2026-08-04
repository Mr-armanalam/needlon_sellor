import React from 'react';
import {Layers} from "lucide-react";

const ProductEmptyState = (
    {handleStartWizard, isCreatingDraft} : { handleStartWizard: () => void; isCreatingDraft: boolean}
) => {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-neutral-200 rounded-3xl bg-white max-w-xl mx-auto mt-8 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100"><Layers size={20} /></div>
            <div className="flex flex-col gap-0.5">
                <h4 className="text-[14px] font-bold text-neutral-800">Your Boutique Shelf is Empty</h4>
                <p className="text-[12px] text-neutral-400 max-w-xs">List your first apparel design product to jumpstart storefront user visibility metrics.</p>
            </div>
            <button onClick={handleStartWizard} disabled={isCreatingDraft} className="mt-2 px-4 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-xl shadow-sm hover:bg-neutral-800 transition-colors disabled:opacity-75">Create Product</button>
        </div>
    );
};

export default ProductEmptyState;