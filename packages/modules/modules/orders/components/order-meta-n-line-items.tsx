import React, { useState, useRef } from 'react';
import {STATUS_LABELS} from "@/modules/orders/constants";
import {FileText, User, Camera, Video, UploadCloud, Loader2, Play, Ruler, AlertCircle, CheckCircle2} from "lucide-react";

const OrderMetaNLineItems = (
    {
        data,
        currentStatus,
        items,
        formatCurrency,
        deliveryAddress,
        reload,
    }:{
        data: any;
        currentStatus: string;
        items: any;
        formatCurrency: (val: string) => string ;
        deliveryAddress: any;
        reload?: () => Promise<void>;
    }
) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const measurement = data?.measurement;
    const essentialEntries = measurement?.essentialMeasurements 
        ? Object.entries(measurement.essentialMeasurements).filter(([_, v]) => v !== undefined && v !== null && v !== "")
        : [];
    const postureEntries = measurement?.postureSpecifics 
        ? Object.entries(measurement.postureSpecifics).filter(([_, v]) => v !== undefined && v !== null && v !== "")
        : [];

    const formatMeasurementLabel = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const mediaList: string[] = Array.isArray(data?.mediaUrls) && data.mediaUrls.length > 0
        ? data.mediaUrls
        : (items?.[0]?.imageUrl ? [items[0].imageUrl] : []);

    const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('caption', file.type.startsWith('video') ? 'Bespoke garment movement / swinging progress video' : 'Bespoke garment craft progress photo');

            const res = await fetch(`/api/seller/orders/${data.id}/media`, {
                method: 'POST',
                body: formData,
            });

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Failed to upload media');
            }

            if (reload) {
                await reload();
            }
        } catch (err: any) {
            setUploadError(err.message || 'Failed to upload craft media');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

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
                            {item.imageUrl || item.thumbnailUrl ? (
                                <img src={item.imageUrl || item.thumbnailUrl} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-neutral-100" />
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

            {/* Bespoke Garment Measurement Details Section (Placed above Customer Records) */}
            {measurement ? (
                <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Ruler size={13} className="text-neutral-600" /> Order Measurement Details
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <h4 className="text-[14px] font-bold text-neutral-900 capitalize">
                                    {measurement.garmentType} {measurement.gender ? `(${measurement.gender})` : ''}
                                </h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                                    {measurement.measurementUnit || "INCHES"}
                                </span>
                                {measurement.fitPreference && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                        {measurement.fitPreference} Fit
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                                <CheckCircle2 size={12} /> {measurement.status}
                            </span>
                        </div>
                    </div>

                    {measurement.editRequested && (
                        <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                            <AlertCircle size={14} className="text-amber-600 shrink-0" />
                            <span>Customer requested measurement update: <i>{measurement.editRequestReason || "Pending approval"}</i></span>
                        </div>
                    )}

                    {essentialEntries.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {essentialEntries.map(([k, v]) => (
                                <div key={k} className="p-2.5 bg-neutral-50/70 border border-neutral-100 rounded-xl flex flex-col">
                                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-tight truncate">
                                        {formatMeasurementLabel(k)}
                                    </span>
                                    <span className="text-[13px] font-bold text-neutral-900 mt-0.5">
                                        {String(v)} {measurement.measurementUnit === 'CM' ? 'cm' : '"'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-neutral-400 italic">No specific metric points recorded.</p>
                    )}

                    {postureEntries.length > 0 && (
                        <div className="pt-2 border-t border-neutral-50">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                                Posture Nuances & Anatomical Nuances
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {postureEntries.map(([k, v]) => (
                                    <span key={k} className="text-[11px] bg-neutral-50 border border-neutral-200/60 px-2 py-1 rounded-lg text-neutral-700">
                                        <b>{formatMeasurementLabel(k)}:</b> {String(v)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {measurement.tailorNotes && (
                        <div className="pt-2 border-t border-neutral-50">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                Master Tailor Craft Notes
                            </span>
                            <p className="text-[12px] text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                                {measurement.tailorNotes}
                            </p>
                        </div>
                    )}
                </div>
            ) : data?.tailoringStage ? (
                <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Ruler size={14} className="text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-700">
                            Bespoke Tailoring Commission (Stage: {data.tailoringStage.replace(/_/g, ' ')})
                        </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">Standard atelier sizing applied</span>
                </div>
            ) : (
                <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Ruler size={14} className="text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-700">
                            Ready-to-Wear Order ({items?.[0]?.variantName || "Standard Sizing"})
                        </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">No custom measurements required</span>
                </div>
            )}

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

            {/* Bespoke Craft Media & Garment Progress Section */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Camera size={12} /> Garment Craft Media & Proof
                        </span>
                        <h4 className="text-[14px] font-bold text-neutral-900 mt-0.5">
                            Progress Photos & Videos ({mediaList.length})
                        </h4>
                    </div>

                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleUploadMedia}
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            {uploading ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <UploadCloud size={13} />
                            )}
                            <span>{uploading ? "Uploading..." : "Add Photo/Video"}</span>
                        </button>
                    </div>
                </div>

                {uploadError && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        {uploadError}
                    </p>
                )}

                {mediaList.length === 0 ? (
                    <div className="py-6 px-4 text-center border-2 border-dashed border-neutral-100 rounded-xl bg-neutral-50/50 flex flex-col items-center gap-2">
                        <div className="p-2 bg-white rounded-full border border-neutral-200 text-neutral-400">
                            <Camera size={18} />
                        </div>
                        <p className="text-xs text-neutral-500 font-medium">
                            No craft progress media uploaded yet.
                        </p>
                        <p className="text-[11px] text-neutral-400 max-w-sm">
                            Upload photos or videos of the garment sewing, fabric, or finished clothes swinging to build customer trust.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaList.map((url, idx) => {
                            const isVideo = url.includes('.mp4') || url.includes('.webm') || url.startsWith('data:video');
                            return (
                                <div key={idx} className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 aspect-square flex items-center justify-center">
                                    {isVideo ? (
                                        <video
                                            src={url}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={url}
                                            alt={`Garment craft ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs">
                                        {isVideo ? "Video" : "Photo"} #{idx + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

    );
};

export default OrderMetaNLineItems;