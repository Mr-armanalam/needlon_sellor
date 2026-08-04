import React from 'react';
import {ArrowRight} from "lucide-react";

const BulkManifestDocFooterAction = (
    {
        onClose,
        handleGenerateManifest,
        loading,
        selectedOrderIds
    }:{
        onClose: () => void;
        handleGenerateManifest: () => void;
        selectedOrderIds: string[];
        loading?: boolean;
    }
) => {
    return (
        <div className="border-t border-neutral-100 pt-4 flex items-center justify-end gap-3 mt-auto">
            <button
                onClick={onClose}
                className="px-4 py-2.5 border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-[12px] font-semibold rounded-xl outline-none"
            >
                Cancel
            </button>
            <button
                onClick={handleGenerateManifest}
                disabled={loading || selectedOrderIds.length === 0}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm outline-none disabled:opacity-50"
            >
                <span>{loading ? "Generating Manifest..." : `Generate Manifest (${selectedOrderIds.length})`}</span>
                <ArrowRight size={14} />
            </button>
        </div>

    );
};

export default BulkManifestDocFooterAction;