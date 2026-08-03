import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Printer,
  Clock,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { getOrderDetailsClient, updateOrderStatusClient } from "../api/order-client";
import { DocumentPreviewModal } from "../section/document-preview-modal";

interface OrderInspectorProps {
  orderId: string;
  onBack: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Accepted",
  PROCESSING: "Packed",
  READY_TO_SHIP: "Ready for Shipment",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURN_APPROVED: "Return Approved",
  RETURN_REJECTED: "Return Rejected",
  RETURNED: "Returned",
};

const PIPELINE_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "OUT_FOR_DELIVERY", "COMPLETED"];

export default function OrderInspector({ orderId, onBack }: OrderInspectorProps) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);


  async function loadDetails() {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderDetailsClient(orderId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError("Failed to load order details.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
  }, [orderId]);

  async function handleAdvance() {
    setActionLoading(true);
    try {
      await updateOrderStatusClient(orderId, "ADVANCE");
      await loadDetails();
    } catch (err: any) {
      alert(err.message || "Failed to advance order");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setActionLoading(true);
    try {
      await updateOrderStatusClient(orderId, "CANCEL");
      await loadDetails();
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-32 text-center text-[13px] font-semibold text-neutral-400">
        Loading order details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-5xl mx-auto py-32 text-center text-[13px] font-semibold text-red-500 flex flex-col gap-4 items-center">
        <span>{error || "Order not found"}</span>
        <button onClick={onBack} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold">
          Back to Orders Queue
        </button>
      </div>
    );
  }

  const { items = [], addresses = [], history = [] } = data;
  const deliveryAddress = addresses.find((a: any) => a.addressType === "DELIVERY") || addresses[0];

  // Calculate current pipeline step index
  const currentStatus = data.status;
  let currentStepIdx = PIPELINE_STEPS.indexOf(currentStatus);
  if (currentStepIdx === -1) {
    if (currentStatus === "DELIVERED") currentStepIdx = 5;
    else currentStepIdx = 0; // fallback
  }

  // Create display timeline steps
  const stepsTimeline = PIPELINE_STEPS.map((stepKey, idx) => {
    // Check if this step has been completed in history
    const historyItem = history.find((h: any) => h.toStatus === stepKey);
    const isCompleted = idx <= currentStepIdx;
    
    let time = "Pending";
    let description = "";

    if (historyItem) {
      time = new Date(historyItem.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      description = historyItem.remarks || "";
    } else if (isCompleted && idx === 0) {
      time = new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      description = "Order placed by buyer.";
    } else {
      if (stepKey === "CONFIRMED") description = "Awaiting boutique acceptance.";
      else if (stepKey === "PROCESSING") description = "Awaiting packaging and label generation.";
      else if (stepKey === "READY_TO_SHIP") description = "Awaiting logistics carrier pickup.";
      else if (stepKey === "OUT_FOR_DELIVERY") description = "Assigned to fulfillment logistics carrier agent.";
      else if (stepKey === "COMPLETED") description = "Secure customer signature delivery pass validation.";
    }

    return {
      label: STATUS_LABELS[stepKey] || stepKey,
      time,
      description,
    };
  });

  const formatCurrency = (val: any) => {
    const num = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const isFinalState = currentStatus === "COMPLETED" || currentStatus === "CANCELLED" || currentStatus === "RETURNED" || currentStatus === "RETURN_REJECTED";
  const buyerFirstName = data.buyerName ? data.buyerName.trim().split(/\s+/)[0] : "Customer";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* 1. INSPECTOR SUB-HEADER MODULE */}
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

      {/* 2. DOUBLE-COLUMN INTERACTIVE FULFILLMENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* LEFT COMPONENT COLUMN: Order Meta & Line Items (Takes up 2/3 width) */}
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

        {/* RIGHT COMPONENT COLUMN: Comprehensive Pipeline Tracking (Takes up 1/3 width) */}
        <div className="lg:col-span-1 bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> Pipeline Tracking
            </span>
            <h3 className="text-[15px] font-bold text-neutral-900 mt-1 tracking-tight">
              Fulfillment Progress
            </h3>
          </div>

          {/* Interactive Stepper Vertical Node Map */}
          <div className="flex flex-col gap-5 pl-1.5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
            {stepsTimeline.map((step, idx) => {
              const isPast = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={idx}
                  className="flex gap-4 items-start relative z-10 group"
                >
                  {/* Node Circle Pin */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 ${
                      isPast
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-transparent"
                    }`}
                  >
                    {isPast && (
                      <CheckCircle2
                        size={10}
                        strokeWidth={3}
                        className="fill-neutral-900"
                      />
                    )}
                  </div>

                  {/* Core Contextual Status Text Block */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[13px] font-semibold transition-colors ${isPast ? "text-neutral-900" : "text-neutral-400"}`}
                      >
                        {step.label}
                      </span>
                      {step.time !== "Pending" && (
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] leading-normal font-medium max-w-xs mt-0.5 ${isCurrent ? "text-neutral-500" : "text-neutral-400"}`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pipeline Action Controls */}
          <div className="flex flex-col gap-2 border-t border-neutral-50 pt-4 mt-2">
            <button
              onClick={handleAdvance}
              disabled={isFinalState || actionLoading}
              className={`w-full py-2.5 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm outline-none ${
                isFinalState 
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none' 
                  : 'bg-neutral-900 hover:bg-neutral-800'
              }`}
            >
              {actionLoading ? "Processing..." : "Advance Step Pipeline"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isFinalState || actionLoading}
              className={`w-full py-2.5 border text-[12px] font-bold rounded-xl transition-all outline-none ${
                isFinalState
                  ? 'border-neutral-100 text-neutral-300 cursor-not-allowed'
                  : 'border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600'
              }`}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      {/* Order Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        orderId={orderId}
        orderNumber={data.orderNumber}
        initialTab="INVOICE"
      />
    </div>
  );
}
