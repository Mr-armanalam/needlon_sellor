"use client";

import React, { useState } from "react";
import { X, Printer, CheckSquare, Square, Truck, Calendar, ArrowRight } from "lucide-react";

interface BulkManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordersList: any[];
}

export function BulkManifestModal({
  isOpen,
  onClose,
  ordersList = [],
}: BulkManifestModalProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(
    ordersList.map((o) => o.id)
  );
  const [courierName, setCourierName] = useState("Express Courier");
  const [pickupDate, setPickupDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manifestHtml, setManifestHtml] = useState<string | null>(null);
  const [manifestNumber, setManifestNumber] = useState<string>("");

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === ordersList.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(ordersList.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const handleGenerateManifest = async () => {
    if (selectedOrderIds.length === 0) {
      alert("Please select at least one order to generate manifest.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/manifest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          courierName,
          pickupDate,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.html) {
        setManifestHtml(data.data.html);
        setManifestNumber(data.data.manifest?.manifestNumber || "MNF-2026-000001");
      } else {
        setError(data.error?.message || "Failed to generate manifest.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate manifest");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintManifest = () => {
    if (!manifestHtml) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(manifestHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-neutral-200/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
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

        {/* Content */}
        {manifestHtml ? (
          <div className="flex-1 bg-neutral-100/70 p-6 overflow-auto flex flex-col items-center justify-start gap-4">
            <div className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-xl shadow-lg overflow-hidden">
              <iframe
                srcDoc={manifestHtml}
                title="Manifest Preview"
                className="w-full h-[550px] border-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintManifest}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm outline-none"
              >
                <Printer size={16} />
                <span>Print Manifest Document</span>
              </button>
              <button
                onClick={() => setManifestHtml(null)}
                className="px-4 py-2.5 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-[13px] font-semibold rounded-xl outline-none"
              >
                Back to Selection
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {/* Courier & Date Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-neutral-700 flex items-center gap-1.5">
                  <Truck size={14} className="text-neutral-500" />
                  <span>Logistics Carrier Courier</span>
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800 outline-none focus:border-neutral-400"
                >
                  <option value="Express Courier">Express Courier</option>
                  <option value="BlueDart Logistics">BlueDart Logistics</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="Shadowfax Local">Shadowfax Local</option>
                  <option value="DTDC Express">DTDC Express</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-neutral-700 flex items-center gap-1.5">
                  <Calendar size={14} className="text-neutral-500" />
                  <span>Pickup Date</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800 outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            {/* Orders Selection List */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-neutral-800">
                  Select Orders ({selectedOrderIds.length} of {ordersList.length} selected)
                </span>
                <button
                  onClick={toggleSelectAll}
                  className="text-[12px] font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {selectedOrderIds.length === ordersList.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[12px] font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {ordersList.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-neutral-400 font-medium">
                    No orders available for manifest generation.
                  </div>
                ) : (
                  ordersList.map((ord) => {
                    const isSelected = selectedOrderIds.includes(ord.id);
                    return (
                      <div
                        key={ord.id}
                        onClick={() => toggleSelectOrder(ord.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-neutral-900/5 border-neutral-900/20"
                            : "bg-white border-neutral-100 hover:border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button className="text-neutral-800">
                            {isSelected ? <CheckSquare size={16} className="text-neutral-900 fill-neutral-900" /> : <Square size={16} className="text-neutral-400" />}
                          </button>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-neutral-900">
                              {ord.buyerName} • {ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {ord.items ? `${ord.items.length} items` : "Items recorded"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-bold text-neutral-900">
                            ₹{parseFloat(ord.grandTotal || "0").toLocaleString("en-IN")}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            ord.paymentMethod === "COD" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {ord.paymentMethod || "PAID"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer Action */}
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
          </div>
        )}

      </div>
    </div>
  );
}
