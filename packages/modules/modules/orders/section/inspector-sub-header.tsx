import React, {Dispatch, SetStateAction} from 'react';
import {STATUS_LABELS} from "@/modules/orders/constants";
import {
    ArrowLeft,
    MessageSquare,
    Printer,
} from "lucide-react";

const InspectorSubHeader = (
    {
        onBack,
        buyerFirstName,
        setIsDocumentModalOpen,
    }:{
        onBack: () => void;
        buyerFirstName: string;
        setIsDocumentModalOpen: Dispatch<SetStateAction<boolean>>;
    }
) => {
    return (
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
            <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group outline-none">
                <ArrowLeft
                    size={16}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                <span>Back to Orders Queue</span>
            </button>

            <div className="flex items-center gap-2">
                <button className="px-3.5 py-2 bg-white border border-neutral-200/80 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all flex items-center gap-1.5 outline-none">
                    <MessageSquare size={14} />
                    <span>Chat with {buyerFirstName}</span>
                </button>
                <button
                    onClick={() => setIsDocumentModalOpen(true)}
                    className="px-3.5 py-2 bg-white border border-neutral-200/80 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all flex items-center gap-1.5 outline-none cursor-pointer"
                >
                    <Printer size={14} />
                    <span>Print Invoice</span>
                </button>
            </div>
        </div>

    );
};

export default InspectorSubHeader;