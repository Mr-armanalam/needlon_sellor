import React, { useState, useRef } from 'react';
import {STATUS_LABELS} from "@/modules/orders/constants";
import {FileText, User, Camera, UploadCloud, Loader2, Ruler, AlertCircle, CheckCircle2, Truck, Phone, MapPin, Plus, Edit3, X} from "lucide-react";
import type {OrderDetailAddressDto, OrderDetailResponseDto, OrderListItemLineDto} from "@/modules/orders/dto";

const OrderMetaNLineItems = (
    {
        data,
        currentStatus,
        items,
        formatCurrency,
        deliveryAddress,
        reload,
    }:{
        data: OrderDetailResponseDto;
        currentStatus: string;
        items: OrderListItemLineDto[];
        formatCurrency: (val: number | string) => string ;
        deliveryAddress: OrderDetailAddressDto | undefined;
        reload?: () => Promise<void>;
    }
) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal state for delivery executive assignment
    const [showExecutiveModal, setShowExecutiveModal] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [executiveName, setExecutiveName] = useState(data?.shipment?.executive?.executiveName || "");
    const [executivePhone, setExecutivePhone] = useState(data?.shipment?.executive?.executivePhone || "");
    const [vehicleType, setVehicleType] = useState(data?.shipment?.executive?.vehicleType || "Bike / Two Wheeler");
    const [courierPartner, setCourierPartner] = useState(data?.shipment?.executive?.courierPartner || "In-House Local Delivery");
    const [trackingNumber, setTrackingNumber] = useState(data?.shipment?.trackingNumber || "");
    const [deliveryStatus, setDeliveryStatus] = useState(data?.shipment?.status || "OUT_FOR_DELIVERY");
    const [deliveryNotes, setDeliveryNotes] = useState(data?.shipment?.executive?.notes || "");

    // Modal state for adding/updating doorstep delivery address
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addrRecipientName, setAddrRecipientName] = useState(deliveryAddress?.recipientName || data?.buyerName || "");
    const [addrPhone, setAddrPhone] = useState(deliveryAddress?.phoneNumber || data?.buyerPhone || "");
    const [addrLine1, setAddrLine1] = useState(deliveryAddress?.addressLine1 || "");
    const [addrLine2, setAddrLine2] = useState(deliveryAddress?.addressLine2 || "");
    const [addrLandmark, setAddrLandmark] = useState(deliveryAddress?.landmark || "");
    const [addrCity, setAddrCity] = useState(deliveryAddress?.city || "");
    const [addrState, setAddrState] = useState(deliveryAddress?.state || "");
    const [addrPostalCode, setAddrPostalCode] = useState(deliveryAddress?.postalCode || "");
    const [addrNotes, setAddrNotes] = useState(deliveryAddress?.deliveryNotes || "");

    const [modalError, setModalError] = useState<string | null>(null);

    const handleAssignExecutive = async (e: React.FormEvent) => {
        e.preventDefault();
        setAssignLoading(true);
        setModalError(null);
        try {
            const res = await fetch(`/api/seller/orders/${data.id}/delivery/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    executiveName,
                    executivePhone,
                    vehicleType,
                    courierPartner,
                    trackingNumber: trackingNumber || undefined,
                    status: deliveryStatus,
                    notes: deliveryNotes || undefined,
                }),
            });
            const json = await res.json();
            if (!json.success) {
                throw new Error(json.error?.message || "Failed to assign delivery executive");
            }
            setShowExecutiveModal(false);
            if (reload) await reload();
        } catch (err: unknown) {
            setModalError(err instanceof Error ? err.message : "Something went wrong assigning executive");
        } finally {
            setAssignLoading(false);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddressLoading(true);
        setModalError(null);
        try {
            const res = await fetch(`/api/seller/orders/${data.id}/delivery/address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientName: addrRecipientName,
                    phoneNumber: addrPhone,
                    addressLine1: addrLine1,
                    addressLine2: addrLine2 || undefined,
                    landmark: addrLandmark || undefined,
                    city: addrCity,
                    state: addrState,
                    postalCode: addrPostalCode,
                    country: 'India',
                    deliveryNotes: addrNotes || undefined,
                }),
            });
            const json = await res.json();
            if (!json.success) {
                throw new Error(json.error?.message || "Failed to save delivery address");
            }
            setShowAddressModal(false);
            if (reload) await reload();
        } catch (err: unknown) {
            setModalError(err instanceof Error ? err.message : "Something went wrong saving address");
        } finally {
            setAddressLoading(false);
        }
    };

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
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload craft media');
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
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-neutral-50/50 last:border-none">
                        <div className="flex items-center gap-3">
                            {item.imageUrl || item.thumbnailUrl ? (
                                <img src={item.imageUrl || item.thumbnailUrl || undefined} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-neutral-100" />
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
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-neutral-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
                                <MapPin size={11} /> Shipping Destination
                            </span>
                            {deliveryAddress ? (
                                <button
                                    type="button"
                                    onClick={() => { setModalError(null); setShowAddressModal(true); }}
                                    className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                    <Edit3 size={11} /> Edit Address
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setModalError(null); setShowAddressModal(true); }}
                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                    <Plus size={11} /> Add Doorstep Address
                                </button>
                            )}
                        </div>
                        {deliveryAddress ? (
                            <span className="text-neutral-500 leading-relaxed mt-0.5">
                                {deliveryAddress.recipientName} ({deliveryAddress.phoneNumber})<br />
                                {deliveryAddress.addressLine1}
                                {deliveryAddress.addressLine2 ? `, ${deliveryAddress.addressLine2}` : ''}
                                {deliveryAddress.landmark ? ` (Landmark: ${deliveryAddress.landmark})` : ''}<br />
                                {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode}
                            </span>
                        ) : (
                            <div className="mt-1 p-2.5 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 flex flex-col gap-1">
                                <span className="text-neutral-600 text-xs font-semibold">Store Walk-in / Self-Pickup</span>
                                <span className="text-[11px] text-neutral-400">If the customer now prefers home delivery, click above to record an address.</span>
                            </div>
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

            {/* Delivery Executive & Local Dispatch Section */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Truck size={13} className="text-neutral-600" /> Delivery Executive & Local Dispatch
                        </span>
                        <h4 className="text-[14px] font-bold text-neutral-900 mt-0.5">
                            {data.shipment?.executive ? "Assigned Fulfillment Rider" : "Fulfillment Dispatch Assignment"}
                        </h4>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setModalError(null); setShowExecutiveModal(true); }}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                        <Truck size={13} />
                        <span>{data.shipment?.executive ? "Reassign Executive" : "Assign Executive"}</span>
                    </button>
                </div>

                {data.shipment?.executive ? (
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[14px] font-bold text-neutral-900">
                                    {data.shipment.executive.executiveName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                                    {data.shipment.status || "ASSIGNED"}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 font-medium">
                                <span>{data.shipment.executive.courierPartner || "In-House Fleet"}</span>
                                <span>•</span>
                                <span>{data.shipment.executive.vehicleType || "Two Wheeler"}</span>
                                {data.shipment.trackingNumber && (
                                    <>
                                        <span>•</span>
                                        <span className="font-mono text-neutral-400">Tracking: {data.shipment.trackingNumber}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <a
                                href={`tel:${data.shipment.executive.executivePhone}`}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                                <Phone size={12} /> Call Executive ({data.shipment.executive.executivePhone})
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 px-4 text-center border-2 border-dashed border-neutral-100 rounded-xl bg-neutral-50/50 flex flex-col items-center gap-1.5">
                        <Truck size={20} className="text-neutral-400" />
                        <p className="text-xs font-semibold text-neutral-600">No delivery executive assigned yet</p>
                        <p className="text-[11px] text-neutral-400 max-w-md">
                            Assign an in-house rider or delivery partner to dispatch this order to customer's doorstep.
                        </p>
                    </div>
                )}
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

            {/* Modal: Assign / Reassign Delivery Executive */}
            {showExecutiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-neutral-800" />
                                <h3 className="text-base font-bold text-neutral-900">
                                    {data.shipment?.executive ? "Update Delivery Executive" : "Assign Delivery Executive"}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowExecutiveModal(false)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {modalError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleAssignExecutive} className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Executive Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={executiveName}
                                        onChange={(e) => setExecutiveName(e.target.value)}
                                        placeholder="e.g. Ramesh Kumar"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={executivePhone}
                                        onChange={(e) => setExecutivePhone(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Delivery Mode / Vehicle
                                    </label>
                                    <select
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                                    >
                                        <option value="Bike / Two Wheeler">Bike / Two Wheeler</option>
                                        <option value="Van / Four Wheeler">Van / Four Wheeler</option>
                                        <option value="Electric Scooter">Electric Scooter</option>
                                        <option value="Local Courier Fleet">Local Courier Fleet</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Logistics Fleet / Partner
                                    </label>
                                    <input
                                        type="text"
                                        value={courierPartner}
                                        onChange={(e) => setCourierPartner(e.target.value)}
                                        placeholder="e.g. In-House Local Fleet"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Tracking / AWB Number
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Auto-generated if empty"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Fulfillment Status
                                    </label>
                                    <select
                                        value={deliveryStatus}
                                        onChange={(e) => setDeliveryStatus(e.target.value)}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                                    >
                                        <option value="READY_TO_SHIP">Ready to Ship</option>
                                        <option value="IN_TRANSIT">In Transit</option>
                                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                        <option value="DELIVERED">Delivered</option>
                                    </select>

                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                    Special Instructions / Notes
                                </label>
                                <textarea
                                    rows={2}
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    placeholder="e.g. Call before arrival, handle bridal lehenga carefully"
                                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => setShowExecutiveModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignLoading}
                                    className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                    {assignLoading && <Loader2 size={13} className="animate-spin" />}
                                    <span>Confirm Assignment</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Add / Update Doorstep Delivery Address */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-neutral-800" />
                                <h3 className="text-base font-bold text-neutral-900">
                                    {deliveryAddress ? "Edit Doorstep Address" : "Add Doorstep Delivery Address"}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddressModal(false)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {modalError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSaveAddress} className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Recipient Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addrRecipientName}
                                        onChange={(e) => setAddrRecipientName(e.target.value)}
                                        placeholder="e.g. Arman Alam"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={addrPhone}
                                        onChange={(e) => setAddrPhone(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                    Address Line 1 (House/Flat, Street) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={addrLine1}
                                    onChange={(e) => setAddrLine1(e.target.value)}
                                    placeholder="e.g. Flat 402, Royal Palms, Lane 5"
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Address Line 2 (Area/Colony)
                                    </label>
                                    <input
                                        type="text"
                                        value={addrLine2}
                                        onChange={(e) => setAddrLine2(e.target.value)}
                                        placeholder="e.g. Koregaon Park"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        value={addrLandmark}
                                        onChange={(e) => setAddrLandmark(e.target.value)}
                                        placeholder="e.g. Near City Mall"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addrCity}
                                        onChange={(e) => setAddrCity(e.target.value)}
                                        placeholder="e.g. Pune"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addrState}
                                        onChange={(e) => setAddrState(e.target.value)}
                                        placeholder="e.g. Maharashtra"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                        PIN Code *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addrPostalCode}
                                        onChange={(e) => setAddrPostalCode(e.target.value)}
                                        placeholder="e.g. 411001"
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                    Delivery Instructions
                                </label>
                                <textarea
                                    rows={2}
                                    value={addrNotes}
                                    onChange={(e) => setAddrNotes(e.target.value)}
                                    placeholder="e.g. Please ring doorbell twice, deliver before 6 PM"
                                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressLoading}
                                    className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                    {addressLoading && <Loader2 size={13} className="animate-spin" />}
                                    <span>Save & Switch to Doorstep Delivery</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
};

export default OrderMetaNLineItems;
