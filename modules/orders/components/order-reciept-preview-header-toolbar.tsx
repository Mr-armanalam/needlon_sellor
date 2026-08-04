import React from 'react';
import {Download, FileText, PackageCheck, Printer, RotateCcw, Tag, X, ZoomIn, ZoomOut} from "lucide-react";

const OrderRecieptPreviewHeaderToolbar = (
    {
        orderNumber,
        setActiveTab,
        activeTab,
        zoom,
        setZoom,
        loading,
        error,
        handlePrint,
        handleDownload,
        onClose
    }:{
        orderNumber?: string;
        setActiveTab: React.Dispatch<React.SetStateAction<"INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL">>;
        activeTab: "INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL";
        zoom: number;
        setZoom: React.Dispatch<React.SetStateAction<number>>;
        loading: boolean;
        error: string | null;
        handlePrint: () => void;
        handleDownload: () => void;
        onClose: () => void;
    }
) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 bg-neutral-50/50">
            <div className="flex items-center gap-3">
                <h3 className="text-[16px] font-bold text-neutral-900">
                    Order Documents {orderNumber ? `• ${orderNumber}` : ""}
                </h3>
                {/* Document Tabs */}
                <div className="flex items-center bg-neutral-200/70 p-0.5 rounded-xl text-[12px] font-semibold">
                    <button
                        onClick={() => setActiveTab("INVOICE")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all outline-none ${
                            activeTab === "INVOICE" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                        <FileText size={13} />
                        <span>Tax Invoice</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("PACKING_SLIP")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all outline-none ${
                            activeTab === "PACKING_SLIP" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                        <PackageCheck size={13} />
                        <span>Packing Slip</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("SHIPPING_LABEL")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all outline-none ${
                            activeTab === "SHIPPING_LABEL" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                        <Tag size={13} />
                        <span>Shipping Label</span>
                    </button>
                </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-neutral-100 px-2 py-1 rounded-xl border border-neutral-200/60 text-[12px]">
                    <button
                        onClick={() => setZoom((z) => Math.max(60, z - 10))}
                        title="Zoom Out"
                        className="p-1 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <ZoomOut size={14} />
                    </button>
                    <span className="px-2 font-bold text-neutral-700 min-w-12 text-center">{zoom}%</span>
                    <button
                        onClick={() => setZoom((z) => Math.min(150, z + 10))}
                        title="Zoom In"
                        className="p-1 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <ZoomIn size={14} />
                    </button>
                    <button
                        onClick={() => setZoom(100)}
                        title="Reset Zoom"
                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors border-l border-neutral-200 ml-1 pl-1.5"
                    >
                        <RotateCcw size={12} />
                    </button>
                </div>

                <button
                    onClick={handlePrint}
                    disabled={loading || !!error}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm outline-none disabled:opacity-50"
                >
                    <Printer size={14} />
                    <span>Print</span>
                </button>

                <button
                    onClick={handleDownload}
                    disabled={loading || !!error}
                    className="px-3.5 py-2 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 text-[12px] font-semibold rounded-xl flex items-center gap-1.5 transition-all outline-none disabled:opacity-50"
                >
                    <Download size={14} />
                    <span>Download</span>
                </button>

                <button
                    onClick={onClose}
                    className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all outline-none ml-2"
                >
                    <X size={18} />
                </button>
            </div>
        </div>

    );
};

export default OrderRecieptPreviewHeaderToolbar;