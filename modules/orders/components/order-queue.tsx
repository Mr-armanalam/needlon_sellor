import React from 'react';
import {ArrowRight, MessageSquare, Printer} from "lucide-react";
import HeaderControls from "@/modules/orders/components/header-controls";
import OrderStagesHorizontalTab from "@/modules/orders/section/order-stages-horizontal-tab";
import OrderQueueList from "@/modules/orders/section/order-queue-list";
import {DocumentPreviewModal} from "@/modules/orders/section/document-preview-modal";
import {BulkManifestModal} from "@/modules/orders/section/bulk-manifest-modal";


const OrderQueue = (
    {
        onInspectOrder,
        setSelectedPreviewOrder,
        setIsPreviewModalOpen,
        order,
    } : {
        order: any;
        onInspectOrder: (order: string) => void;
        setSelectedPreviewOrder:  React.Dispatch<React.SetStateAction<any | null>>;
        setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }
) => {

    function getInitials(name: string) {
        if (!name) return "??";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function getRelativeTime(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        return date.toLocaleDateString();
    }

    function formatItems(itemsList: any[]) {
        if (!itemsList || itemsList.length === 0) return "No items";
        const firstItem = itemsList[0];
        const count = itemsList.reduce((acc, it) => acc + (it.quantity || 1), 0);
        const details = `${firstItem.productName || "Product"}${firstItem.variantName ? ` (${firstItem.variantName})` : ''}`;
        if (itemsList.length === 1) {
            return `${firstItem.quantity}x ${details}`;
        }
        return `${firstItem.quantity}x ${details} + ${count - firstItem.quantity} other items`;
    }

    function formatAmount(amount: string | number) {
        const num = parseFloat(amount.toString()) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num);
    }

    return (
        <div
            className="group bg-white border border-neutral-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.015)]"
        >
            {/* Customer & Description Identity */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-700 border border-neutral-100 flex items-center justify-center font-bold text-[13px] shadow-inner shrink-0">
                    {getInitials(order.buyerName)}
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-bold text-neutral-900 tracking-tight">{order.buyerName}</span>
                        <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100/70 px-1.5 py-0.5 rounded-md">{order.orderNumber}</span>
                        <span className="text-[11px] font-medium text-neutral-400">• {getRelativeTime(order.createdAt)}</span>
                    </div>
                    <span className="text-[13px] text-neutral-500 line-clamp-1 mt-0.5">{formatItems(order.items)}</span>
                </div>
            </div>

            {/* Price & Action Interactive Row */}
            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0 border-neutral-50">
                <div className="flex flex-col md:items-end gap-0.5">
                    <span className="text-[15px] font-bold text-neutral-900">{formatAmount(order.grandTotal)}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded max-w-max uppercase ${
                        order.paymentStatus === 'PAID' ? 'text-emerald-600 bg-emerald-50' :
                            order.paymentStatus === 'PENDING' ? 'text-amber-600 bg-amber-50' : 'text-neutral-500 bg-neutral-100'
                    }`}>
                    {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentMethod}
                  </span>
                </div>

                {/* Action Suite */}
                <div className="flex items-center gap-1.5">
                    <button title="Open Customer Chat" className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-neutral-100 transition-all duration-150">
                        <MessageSquare size={16} />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedPreviewOrder(order);
                            setIsPreviewModalOpen(true);
                        }}
                        title="Print Packing Invoice & Labels"
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-neutral-100 transition-all duration-150 cursor-pointer"
                    >
                        <Printer size={16} />
                    </button>
                    <button onClick={() => onInspectOrder(order.id)} title="View Full Order Timeline" className="pl-3 pr-2.5 py-2 bg-neutral-50 border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent text-neutral-800 text-[12px] font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 outline-none">
                        <span>Inspect Details</span>
                        <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default OrderQueue;