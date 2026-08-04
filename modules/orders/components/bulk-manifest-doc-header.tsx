import React from 'react';
import {Printer, X} from "lucide-react";

const BulkManifestDocHeader = (
    {
        manifestHtml,
        manifestNumber,
        onClose
    }:{
        manifestHtml: string;
        manifestNumber: string;
        onClose: () => void;
    }
) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 bg-neutral-50/50">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
                    <Printer size={16} />
                </div>
                <div>
                    <h3 className="text-[16px] font-bold text-neutral-900 leading-tight">
                        {manifestHtml ? `Manifest Ready (${manifestNumber})` : "Generate Courier Shipment Manifest"}
                    </h3>
                    <p className="text-[12px] text-neutral-500 font-normal">
                        {manifestHtml ? "Preview and print courier handover manifest document" : "Select accepted/packed orders to generate a single courier handover document."}
                    </p>
                </div>
            </div>

            <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all outline-none"
            >
                <X size={18} />
            </button>
        </div>

    );
};

export default BulkManifestDocHeader;