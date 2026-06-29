import React, { useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Printer,
  ShieldCheck,
  Clock,
  User,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function OrderInspector() {
  // Current pipeline status index state (0: Placed, 1: Accepted, 2: Packed, 3: Out for Delivery, 4: Completed)
  const [currentStatusIdx, setCurrentStatusIdx] = useState(1);

  const stepsTimeline = [
    {
      label: "Order Placed",
      time: "Today, 11:32 AM",
      description: "Customer initiated authorization hold.",
    },
    {
      label: "Accepted",
      time: "Today, 11:38 AM",
      description: "Confirmed against boutique warehouse stock availability.",
    },
    {
      label: "Packed & Label Generated",
      time: "Pending",
      description: "Awaiting container assignment tracking numbers.",
    },
    {
      label: "Out for Delivery",
      time: "Pending",
      description: "Assigned to fulfillment logistics carrier agent.",
    },
    {
      label: "Completed",
      time: "Pending",
      description: "Secure customer signature delivery pass validation.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* 1. INSPECTOR SUB-HEADER MODULE */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
        <button className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group outline-none">
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          <span>Back to Orders Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 bg-white border border-neutral-200/80 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all flex items-center gap-1.5 outline-none">
            <MessageSquare size={14} />
            <span>Chat with Priya</span>
          </button>
          <button className="px-3.5 py-2 bg-white border border-neutral-200/80 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all flex items-center gap-1.5 outline-none">
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
                  NDLN-8421
                </span>
              </div>
              <span className="text-[12px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                Fulfillment Pending
              </span>
            </div>

            {/* List Array Line Item Item row */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 font-bold flex items-center justify-center text-[13px] shadow-inner">
                  CK
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-neutral-800 tracking-tight">
                    Handloom Chikankari Kurti
                  </span>
                  <span className="text-[11px] font-medium text-neutral-400 mt-0.5">
                    Size: Medium • Qty: 1
                  </span>
                </div>
              </div>
              <span className="text-[14px] font-bold text-neutral-900">
                ₹2,450
              </span>
            </div>

            {/* Pricing Financial Ticker Block */}
            <div className="border-t border-neutral-100/70 pt-4 flex flex-col gap-2 text-[13px] text-neutral-500 font-medium">
              <div className="flex items-center justify-between">
                <span>Subtotal Value</span>
                <span className="text-neutral-800">₹2,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Logistics Shipping Fee</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-50 pt-2 text-[15px] font-bold text-neutral-900">
                <span>Total Revenue Collected</span>
                <span>₹2,450</span>
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
                  Kriti Deshmukh
                </span>
                <span>kriti.deshmukh@email.com</span>
                <span>+91 98765 43210</span>
                <span className="mt-2 text-neutral-400 font-semibold text-[11px] uppercase tracking-wider">
                  Shipping Destination
                </span>
                <span className="text-neutral-500 leading-relaxed mt-0.5">
                  Apartment 402, Springdale Towers, Malad West, Mumbai, MH -
                  400064
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} /> Fulfillment Admin Notes
              </span>
              <textarea
                rows={3}
                placeholder="Type temporary packing observations or special customer delivery instructions here..."
                className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[12px] font-medium outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none text-neutral-700 leading-relaxed"
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
              const isPast = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;

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
              onClick={() => setCurrentStatusIdx((prev) => Math.min(prev + 1, 4))}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-bold rounded-xl transition-colors shadow-sm outline-none"
            >
              Advance Step Pipeline
            </button>
            <button className="w-full py-2.5 bg-white border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600 text-[12px] font-bold rounded-xl transition-colors outline-none">
              Cancel Order Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
