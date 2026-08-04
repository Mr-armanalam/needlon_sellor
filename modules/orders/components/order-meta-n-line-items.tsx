import React from 'react';
import {STATUS_LABELS} from "@/modules/orders/constants";
import {FileText, User} from "lucide-react";

const OrderMetaNLineItems = (
    {
        data,
        currentStatus,
        items,
        formatCurrency,
        deliveryAddress,
    }:{
        data: any;
        currentStatus: string;
        items: any;
        formatCurrency: (val: string) => string ;
        deliveryAddress: any;
    }
) => {

    return (
        <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Itemized Boutique Receipt Container */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                    <div className="flex flex-col">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Order ID Code
                </span>
                        <span className="text-[15px] font-bold text-neutral-900 tracking-tight mt-0.5">
                  {data.orderNumber}
                </span>
                    </div>
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                        currentStatus === 'COMPLETED' ? 'text-emerald-700 bg-emerald-50' :
                            currentStatus === 'CANCELLED' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'
                    }`}>
                {STATUS_LABELS[currentStatus] || currentStatus}
              </span>
                </div>

                {/* List Array Line Item Item row */}
                {items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-neutral-50/50 last:border-none">
                        <div className="flex items-center gap-3">
                            {item.thumbnailUrl ? (
                                <img src={item.thumbnailUrl} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-neutral-100" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 font-bold flex items-center justify-center text-[13px] shadow-inner shrink-0">
                                    {item.productName ? item.productName.substring(0, 2).toUpperCase() : "PR"}
                                </div>
                            )}
                            <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-neutral-800 tracking-tight">
                      {item.productName}
                    </span>
                                <span className="text-[11px] font-medium text-neutral-400 mt-0.5">
                      {item.variantName ? `Variant: ${item.variantName} • ` : ''}Qty: {item.quantity}
                    </span>
                            </div>
                        </div>
                        <span className="text-[14px] font-bold text-neutral-900">
                  {formatCurrency(item.total)}
                </span>
                    </div>
                ))}

                {/* Pricing Financial Ticker Block */}
                <div className="border-t border-neutral-100/70 pt-4 flex flex-col gap-2 text-[13px] text-neutral-500 font-medium">
                    <div className="flex items-center justify-between">
                        <span>Subtotal Value</span>
                        <span className="text-neutral-800">{formatCurrency(data.subtotal)}</span>
                    </div>
                    {parseFloat(data.discountAmount) > 0 && (
                        <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <span className="text-emerald-600 font-semibold">-{formatCurrency(data.discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span>Logistics Shipping Fee</span>
                        <span className="text-emerald-600 font-semibold">
                  {parseFloat(data.shippingCharge) === 0 ? "Free" : formatCurrency(data.shippingCharge)}
                </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-50 pt-2 text-[15px] font-bold text-neutral-900">
                        <span>Total Revenue Collected</span>
                        <span>{formatCurrency(data.grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Customer Records & Interactive Admin Notes Section */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} /> Customer Records
              </span>
                    <div className="flex flex-col text-[13px] text-neutral-600 gap-1">
                <span className="font-bold text-neutral-900">
                  {data.buyerName}
                </span>
                        <span>{data.buyerEmail}</span>
                        <span>{data.buyerPhone}</span>
                        <span className="mt-2 text-neutral-400 font-semibold text-[11px] uppercase tracking-wider">
                  Shipping Destination
                </span>
                        {deliveryAddress ? (
                            <span className="text-neutral-500 leading-relaxed mt-0.5">
                    {deliveryAddress.recipientName} ({deliveryAddress.phoneNumber})<br />
                                {deliveryAddress.addressLine1}
                                {deliveryAddress.addressLine2 ? `, ${deliveryAddress.addressLine2}` : ''}
                                {deliveryAddress.landmark ? ` (Landmark: ${deliveryAddress.landmark})` : ''}<br />
                                {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode}
                  </span>
                        ) : (
                            <span className="text-neutral-500 italic mt-0.5">No shipping address recorded.</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} /> Fulfillment Admin Remarks
              </span>
                    <textarea
                        rows={4}
                        readOnly
                        value={data.sellerRemark || data.internalRemark || "No special instructions provided."}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[12px] font-medium outline-none text-neutral-700 leading-relaxed resize-none cursor-default"
                    />
                </div>
            </div>
        </div>

    );
};

export default OrderMetaNLineItems;