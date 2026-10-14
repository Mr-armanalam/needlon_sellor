'use client';


import { apiFetch } from "@/modules/auth/lib/auth-client";
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Ruler, Banknote, FileText, Loader2, Camera, Video, UploadCloud, Trash2, Truck, MapPin, Calendar } from 'lucide-react';

interface CreateInStoreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  measurements: Array<{ id: string; garmentType: string; unit: string; date: string }>;
  onOrderCreated: () => void;
}

export default function CreateInStoreOrderModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  measurements,
  onOrderCreated,
}: CreateInStoreOrderModalProps) {
  const [garmentName, setGarmentName] = useState('');
  const [measurementId, setMeasurementId] = useState(measurements[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [tailoringStage, setTailoringStage] = useState('ORDER_PLACED');
  const [tailoringNotes, setTailoringNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING' | 'PARTIAL'>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'COD'>('CASH');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO' | null>(null);

  // Delivery options state
  const [deliveryMethod, setDeliveryMethod] = useState<'STORE_PICKUP' | 'HOME_DELIVERY'>('STORE_PICKUP');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState('');
  const [shippingPartnerId, setShippingPartnerId] = useState('');
  const [partners, setPartners] = useState<Array<{ id: string; partnerName: string; partnerCode: string }>>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      apiFetch('/api/seller/delivery/partners')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setPartners(json.data);
            if (json.data[0]) setShippingPartnerId(json.data[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!garmentName.trim()) {
      setError('Please enter garment name / commission title');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid price amount');
      return;
    }

    if (deliveryMethod === 'HOME_DELIVERY') {
      if (!addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
        setError('Please fill in street address, city, state, and pincode for home delivery');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: any = {
        customerId,
        measurementId: measurementId || null,
        garmentName: garmentName.trim(),
        amount: parsedAmount,
        tailoringStage,
        tailoringNotes: tailoringNotes.trim() || null,
        paymentStatus,
        paymentMethod,
        imageUrl: mediaPreview || null,
        mediaUrls: mediaPreview ? [mediaPreview] : [],
        deliveryMethod,
      };

      if (deliveryMethod === 'HOME_DELIVERY') {
        payload.shippingAddress = {
          recipientName: customerName,
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        };
        payload.shippingPartnerId = shippingPartnerId || undefined;
        payload.estimatedDeliveryAt = estimatedDeliveryAt || undefined;
      }

      const res = await apiFetch('/api/seller/orders/in-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to create order');
      }

      onOrderCreated();
      onClose();
      // Reset
      setGarmentName('');
      setAmount('');
      setTailoringNotes('');
      setMediaPreview(null);
      setMediaType(null);
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      setDeliveryMethod('STORE_PICKUP');
    } catch (err: any) {
      setError(err.message || 'Failed to create in-store order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Create In-Store Bespoke Order</h3>
              <p className="text-xs text-gray-500">Attach commission to {customerName}&apos;s account</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Garment / Commission Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Bespoke Italian Wool 2-Piece Suit"
              value={garmentName}
              onChange={(e) => setGarmentName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link Measurement Profile
              </label>
              <div className="relative">
                <select
                  value={measurementId}
                  onChange={(e) => setMeasurementId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 truncate"
                >
                  <option value="">No profile / Standard</option>
                  {measurements.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.garmentType.toUpperCase()} ({m.unit}) - {m.date}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Total Price (₹) *
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="100"
                  placeholder="e.g. 8500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Initial Tailoring Milestone
              </label>
              <select
                value={tailoringStage}
                onChange={(e) => setTailoringStage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ORDER_PLACED">Order Placed</option>
                <option value="MEASUREMENT_VERIFIED">Measurement Verified</option>
                <option value="PATTERN_DRAFTING">Pattern Drafting</option>
                <option value="IN_CUTTING">In Cutting</option>
                <option value="TRIAL_FITTING">Trial / Fitting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="PAID">Paid in Full</option>
                <option value="PARTIAL">Advance Deposit (Partial)</option>
                <option value="PENDING">Payment Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="flex gap-2">
              {(['CASH', 'UPI', 'CARD'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Fulfillment & Delivery Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Fulfillment & Delivery Method *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMethod('STORE_PICKUP')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deliveryMethod === 'STORE_PICKUP'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Atelier Pickup (Walk-in)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('HOME_DELIVERY')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deliveryMethod === 'HOME_DELIVERY'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Home Delivery</span>
              </button>
            </div>
          </div>

          {/* Conditional Delivery Address and Logistics Selection */}
          {deliveryMethod === 'HOME_DELIVERY' && (
            <div className="p-3.5 bg-neutral-50/80 border border-neutral-200 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                <span>Customer Shipping Address</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Street Address, Flat / House No., Building *"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Landmark / Locality (Optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="State *"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Postal Pincode *"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200/60">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Assign Carrier / Partner
                  </label>
                  <select
                    value={shippingPartnerId}
                    onChange={(e) => setShippingPartnerId(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">In-House Delivery Partner</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.partnerName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Target Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDeliveryAt}
                    onChange={(e) => setEstimatedDeliveryAt(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Fabric Specifications & Cutting Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <textarea
                rows={2}
                placeholder="e.g. Client provided self-fabric; 1st trial fitting scheduled for Thursday."
                value={tailoringNotes}
                onChange={(e) => setTailoringNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Garment Media Upload (Photos or Videos) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-neutral-600" />
                Garment Reference Photo or Video (Optional)
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, MP4, WEBM</span>
            </label>
            
            {mediaPreview ? (
              <div className="relative rounded-xl border border-neutral-200 overflow-hidden bg-black/5 p-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {mediaType === 'VIDEO' ? (
                    <video src={mediaPreview} className="w-14 h-14 rounded-lg object-cover bg-black" controls muted />
                  ) : (
                    <img src={mediaPreview} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-neutral-200" />
                  )}
                  <div className="truncate">
                    <p className="text-xs font-semibold text-neutral-800">
                      {mediaType === 'VIDEO' ? 'Garment Video Attached' : 'Garment Photo Attached'}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      Will be visible to buyer in their live tracking
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPreview(null);
                    setMediaType(null);
                  }}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl bg-gray-50/70 hover:bg-emerald-50/20 cursor-pointer transition-all">
                <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-xs font-medium text-gray-600">Click to upload photo or short video</span>
                <span className="text-[10px] text-gray-400">Fabric swatch, mannequin, or sample</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const isVid = file.type.startsWith('video');
                      setMediaType(isVid ? 'VIDEO' : 'IMAGE');
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMediaPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Creating Order...' : 'Create In-Store Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
