import React from 'react';
import {Loader2, Plus} from "lucide-react";

const HeaderNBulkUploadOption = ({handleBulkUploadClick, handleStartWizard, isCreatingDraft} : {
    handleBulkUploadClick: () => void;
    handleStartWizard: () => void;
    isCreatingDraft: boolean;
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
                <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight">Products Shelf</h2>
                <p className="text-[13px] text-neutral-400">Organize, track performance, and visually align your showcase boutique items.</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleBulkUploadClick}
                    className="px-4 py-2 text-[13px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 rounded-xl transition-all duration-200"
                >
                    Bulk Upload
                </button>
                <button
                    onClick={handleStartWizard}
                    disabled={isCreatingDraft}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm group outline-none disabled:opacity-75"
                >
                    {isCreatingDraft ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={2.5} />}
                    <span>Add Product</span>
                </button>
            </div>
        </div>
    );
};

export default HeaderNBulkUploadOption;