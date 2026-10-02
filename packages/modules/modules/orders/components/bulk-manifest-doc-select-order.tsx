import React from 'react';
import {CheckSquare, Square} from "lucide-react";

const BulkManifestDocSelectOrder = (
    {
        selectedOrderIds,
        ordersList,
        toggleSelectAll,
        error,
        toggleSelectOrder,
    }:{
        selectedOrderIds: string[];
        ordersList: any[];
        toggleSelectAll: () => void;
        error: string | null;
        toggleSelectOrder: (id: string) => void;
    }
) => {
    return (
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

    );
};

export default BulkManifestDocSelectOrder;