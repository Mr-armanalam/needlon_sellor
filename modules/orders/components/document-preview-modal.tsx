"use client";

import React, { useState, useEffect } from "react";
import { X, Printer, Download, ZoomIn, ZoomOut, RotateCcw, FileText, PackageCheck, Tag } from "lucide-react";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  initialTab?: "INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL";
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  initialTab = "INVOICE",
}: DocumentPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL">(initialTab);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setZoom(100);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen || !orderId) return;

    async function fetchDocument() {
      setLoading(true);
      setError(null);
      try {
        let endpoint = `/api/orders/${orderId}/invoice`;
        if (activeTab === "PACKING_SLIP") {
          endpoint = `/api/orders/${orderId}/packing-slip`;
        } else if (activeTab === "SHIPPING_LABEL") {
          endpoint = `/api/orders/${orderId}/shipping-label`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.success && data.data?.html) {
          setHtmlContent(data.data.html);
        } else {
          setError(data.error?.message || "Failed to load document preview");
        }
      } catch (err: any) {
        setError(err.message || "Failed to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [isOpen, orderId, activeTab]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab.toLowerCase()}_${orderNumber || orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-neutral-200/80 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Toolbar */}
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

        {/* Content Viewport */}
        <div className="flex-1 bg-neutral-100/70 p-6 overflow-auto flex justify-center items-start">
          {loading ? (
            <div className="py-24 text-center text-[13px] font-semibold text-neutral-400 animate-pulse">
              Generating document preview...
            </div>
          ) : error ? (
            <div className="py-24 text-center text-[13px] font-semibold text-red-500">
              {error}
            </div>
          ) : (
            <div
              className="transition-transform duration-200 bg-white shadow-xl rounded-lg overflow-hidden border border-neutral-200/80"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: activeTab === "SHIPPING_LABEL" ? "420px" : "800px",
              }}
            >
              <iframe
                srcDoc={htmlContent}
                title="Document View"
                className="w-full border-none"
                style={{
                  height: activeTab === "SHIPPING_LABEL" ? "620px" : "1050px",
                }}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
