'use client';
import React, { useState } from 'react';
import { MapPin, MessageSquare, Star, ShoppingBag, Calendar, Scissors, Ruler, Plus, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useCustomerDetails } from '../hooks/use-customer-details';
import RecordMeasurementModal from '../components/record-measurement-modal';
import CreateInStoreOrderModal from '../components/create-in-store-order-modal';
import UpdateTailoringStageModal from '../components/update-tailoring-stage-modal';
import ChatPermissionModal from '../components/chat-permission-modal';
import ScheduleFittingModal from '../components/schedule-fitting-modal';
import OrderHandoverModal from '../components/order-handover-modal';

export interface CustomerDetailProps {
  customer: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    clv: string;
    totalOrders: number;
    isRepeat: boolean;
  } | null;
  onOpenChat: () => void;
}

export default function CustomerDetail({ customer, onOpenChat }: CustomerDetailProps) {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isInStoreOrderOpen, setIsInStoreOrderOpen] = useState(false);
  const [isUpdateStageOpen, setIsUpdateStageOpen] = useState(false);
  const [selectedOrderForStage, setSelectedOrderForStage] = useState<any>(null);
  const [isFittingModalOpen, setIsFittingModalOpen] = useState(false);
  const [selectedOrderForFitting, setSelectedOrderForFitting] = useState<any>(null);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [selectedOrderForHandover, setSelectedOrderForHandover] = useState<any>(null);
  const [isChatPermissionModalOpen, setIsChatPermissionModalOpen] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
  const [isUnassignedExpanded, setIsUnassignedExpanded] = useState<boolean>(false);
  const { data, loading, refetch } = useCustomerDetails(customer?.id);

  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-sm text-gray-400">
        Select a customer record to view activity timeline.
      </div>
    );
  }

  const history = data.history;
  const reviews = data.reviews;
  

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-y-auto min-h-0">
      {/* 1. Profile Core Card Banner */}
      <div className="bg-white border-b border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <img src={customer.avatar} alt="" className="w-16 h-16 rounded-full object-cover bg-gray-50 border border-gray-100" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{customer.name}</h2>
              {customer.isRepeat && (
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">Repeat Buyer</span>
              )}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {customer.location}
            </p>
          </div>
        </div>

        {/* Primary Action Button: Communication Pivot Hook */}
        <button 
          onClick={() => setIsChatPermissionModalOpen(true)}
          className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" /> Message Customer
        </button>
      </div>

      {/* 2. Secondary Data Grid Stream Blocks */}
      <div className="p-6 space-y-6 flex-1 min-h-0">
        
        {/* Core Metric Highlights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Customer Lifetime Value (CLV)</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{customer.clv}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Completed Orders</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{customer.totalOrders} total</p>
          </div>
        </div>

        {/* Reviews Left by User */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Reviews & Feedback</h3>
          {loading ? (
            <div className="p-4 text-xs text-neutral-400 text-center">Loading customer feedback...</div>
          ) : reviews.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              No reviews submitted by this customer yet.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">"{rev.comment}"</p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" /> Item: <span className="font-medium text-gray-500">{rev.product}</span>
                </p>
              </div>
            ))
          )}
        </div>

        {(() => {
          const toggleOrderAccordion = (orderId: string) => {
            setExpandedOrderIds((prev) => {
              const next = new Set(prev);
              if (next.has(orderId)) {
                next.delete(orderId);
              } else {
                next.add(orderId);
              }
              return next;
            });
          };

          const unassignedMeasurements = (data.measurements || []).filter(
            (m: any) =>
              !history.some(
                (order: any) =>
                  (m.orderId && (m.orderId === order.orderId || m.orderId === order.id)) ||
                  (m.orderNumber && (m.orderNumber === order.id || m.orderNumber === order.orderId)) ||
                  (m.garmentType && order.garmentType && m.garmentType.toLowerCase() === order.garmentType.toLowerCase())
              )
          );

          const renderMeasurementCard = (m: any, isInsideOrder = false) => (
            <div
              key={m.id}
              className={`rounded-xl p-4 space-y-3 ${
                isInsideOrder
                  ? "bg-neutral-50/80 border border-neutral-200/80 shadow-2xs"
                  : "bg-white border border-gray-200/80 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between border-b border-gray-200/70 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                      {m.garmentType.replace(/_/g, " ")} ({m.gender})
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-900 text-white rounded">
                      {m.unit}
                    </span>
                    {m.fitPreference && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                        {m.fitPreference} FIT
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Source: {m.source === "IN_STORE_TAILOR_MASTER" ? "In-Store Tailor Master" : "Customer Online Intake"} • Recorded: {m.date}
                  </p>
                </div>
                {!isInsideOrder && (
                  <div>
                    {m.orderNumber ? (
                      <span className="text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                        {m.orderNumber}
                      </span>
                    ) : m.orderId ? (
                      <span className="text-[11px] font-medium text-neutral-500">
                        Order #{m.orderId.slice(-6)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
                        In-Store Spec
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Revision Request Banner */}
              {m.editRequested && (
                <div className="flex items-center justify-between gap-2 p-2 bg-amber-50/80 rounded-lg border border-amber-200/70 text-xs">
                  <span className="text-[11px] font-semibold text-amber-900">
                    Customer requested revision{m.editRequestReason ? `: "${m.editRequestReason}"` : ""}
                  </span>
                  {!m.isEditable ? (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = await fetch(`/api/seller/measurements/${m.id}/allow-edit`, { method: "POST" });
                          if (res.ok) {
                            refetch();
                          } else {
                            alert("Failed to enable edit permission");
                          }
                        } catch (e) {
                          alert("Network error");
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      Allow Customer Edit
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      Edit Enabled for Customer
                    </span>
                  )}
                </div>
              )}

              {/* Essential Measurements Grid */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-neutral-500" /> Essential Measurements
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(m.essentialMeasurements || {}).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2 bg-white rounded-lg border border-neutral-100 flex flex-col"
                    >
                      <span className="text-[10px] text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {String(val)} {m.unit === "CM" ? "cm" : "in"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posture & Bespoke Specifics if available */}
              {m.postureSpecifics && Object.keys(m.postureSpecifics).length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Bespoke & Posture Nuances
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(m.postureSpecifics).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2 bg-white rounded-lg border border-neutral-100 flex flex-col"
                      >
                        <span className="text-[10px] text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailor Cutting Notes */}
              {m.tailorNotes && (
                <div className="p-2.5 bg-amber-50/60 border border-amber-200/50 rounded-lg text-xs text-amber-900">
                  <span className="font-bold">Tailor Master Instructions: </span>
                  {m.tailorNotes}
                </div>
              )}
            </div>
          );

          return (
            <>
              {/* Standalone / Unassigned Physical Measurements Accordion (initially closed) */}
              {unassignedMeasurements.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div
                    onClick={() => setIsUnassignedExpanded(!isUnassignedExpanded)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-neutral-800" />
                      <h3 className="text-xs font-bold text-gray-800">
                        Standalone Profile Specs ({unassignedMeasurements.length})
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        • Physical measurements not yet linked to an active order
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRecordModalOpen(true);
                        }}
                        className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        title="Record new bespoke physical measurement"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Record Spec</span>
                      </button>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isUnassignedExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                  {isUnassignedExpanded && (
                    <div className="p-3.5 pt-0 space-y-3 border-t border-gray-100">
                      {unassignedMeasurements.map((m: any) => renderMeasurementCard(m, false))}
                    </div>
                  )}
                </div>
              )}

              {/* Order Log History Ledger with Accordion for Measurement Orders */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Order Log</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md">
                      {history.length} Order{history.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRecordModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Record new bespoke physical measurement"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Record Spec</span>
                    </button>
                    <button
                      onClick={() => setIsInStoreOrderOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Create in-store custom tailored order"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>+ In-Store Order</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                  {loading ? (
                    <div className="p-4 text-xs text-neutral-400 text-center">Loading order history...</div>
                  ) : history.length === 0 ? (
                    <div className="p-6 text-center space-y-2">
                      <p className="text-xs text-gray-400">No recent order history found for this customer.</p>
                      <button
                        onClick={() => setIsInStoreOrderOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Create First In-Store Order
                      </button>
                    </div>
                  ) : (
                    history.map((order: any) => {
                      const matchingMeasurements = (data.measurements || []).filter(
                        (m: any) =>
                          (m.orderId && (m.orderId === order.orderId || m.orderId === order.id)) ||
                          (m.orderNumber && (m.orderNumber === order.id || m.orderNumber === order.orderId)) ||
                          (m.garmentType && order.garmentType && m.garmentType.toLowerCase() === order.garmentType.toLowerCase())
                      );
                      const hasMeasurements = matchingMeasurements.length > 0;
                      const isExpanded = expandedOrderIds.has(order.id);

                      return (
                        <div
                          key={order.id}
                          className={`p-4 transition-colors ${
                            hasMeasurements && isExpanded ? "bg-slate-50/60" : "bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 text-xs">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-gray-900 tracking-tight">{order.id}</p>
                                {order.source === "IN_STORE" && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    In-Store Atelier
                                  </span>
                                )}
                                {order.isBespoke ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    Bespoke ({order.garmentType || "Custom Fit"})
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                                    {order.size || "Ready-to-Wear"}
                                  </span>
                                )}

                                {/* ACCORDION TOGGLE: Works ONLY for orders that contain measurement */}
                                {hasMeasurements && (
                                  <button
                                    type="button"
                                    onClick={() => toggleOrderAccordion(order.id)}
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                                      isExpanded
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200"
                                    }`}
                                    title={isExpanded ? "Collapse measurements" : "Expand measurements"}
                                  >
                                    <Ruler className="w-3 h-3" />
                                    <span>{matchingMeasurements.length} Measurement{matchingMeasurements.length > 1 ? "s" : ""}</span>
                                    <ChevronDown
                                      className={`w-3 h-3 transition-transform duration-200 ${
                                        isExpanded ? "rotate-180 text-white" : "text-neutral-500"
                                      }`}
                                    />
                                  </button>
                                )}
                              </div>

                              <p className="text-gray-400 flex items-center gap-1 text-[11px]">
                                <Calendar className="w-3 h-3" /> {order.date}
                              </p>

                              {/* Tailoring Milestone Status */}
                              {order.tailoringStage && (
                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-white flex items-center gap-1">
                                    <Scissors className="w-2.5 h-2.5" />
                                    {order.tailoringStage.replace(/_/g, " ")}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedOrderForStage({
                                        id: order.orderId,
                                        orderNumber: order.id,
                                        stage: order.tailoringStage,
                                        notes: order.tailoringNotes,
                                      });
                                      setIsUpdateStageOpen(true);
                                    }}
                                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                                  >
                                    Milestone
                                  </button>
                                  <span className="text-gray-300">•</span>
                                  <button
                                    onClick={() => {
                                      setSelectedOrderForFitting({
                                        id: order.orderId,
                                        orderNumber: order.id,
                                      });
                                      setIsFittingModalOpen(true);
                                    }}
                                    className="text-[10px] text-purple-600 hover:text-purple-800 font-bold hover:underline cursor-pointer"
                                  >
                                    Schedule Fitting
                                  </button>
                                  {order.status !== "COMPLETED" && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <button
                                        onClick={() => {
                                          setSelectedOrderForHandover({
                                            id: order.orderId,
                                            orderNumber: order.id,
                                            total: order.total,
                                            paymentStatus: order.paymentStatus || "PAID",
                                          });
                                          setIsHandoverModalOpen(true);
                                        }}
                                        className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                                      >
                                        Handover
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}

                              {order.tailoringNotes && (
                                <p className="text-[11px] text-amber-800 bg-amber-50/60 px-2 py-0.5 rounded border border-amber-200/50 mt-1">
                                  Note: {order.tailoringNotes}
                                </p>
                              )}
                            </div>

                            <div className="text-right space-y-1 shrink-0">
                              <p className="font-bold text-gray-900">{order.total}</p>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  order.status === "DELIVERED" || order.status === "Delivered" || order.status === "COMPLETED"
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* ACCORDION CONTENT: Expands inline only for orders that have measurements */}
                          {hasMeasurements && isExpanded && (
                            <div className="mt-3.5 pt-3 border-t border-gray-200/70 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                                  <Scissors className="w-3 h-3 text-neutral-700" />
                                  Attached Tailoring Measurements & Specs
                                </span>
                              </div>
                              <div className="space-y-3">
                                {matchingMeasurements.map((m: any) => renderMeasurementCard(m, true))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          );
        })()}

      </div>

      {/* In-Store Bespoke Measurement Intake Modal */}
      <RecordMeasurementModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        customerId={customer.id}
        customerName={customer.name}
        onMeasurementSaved={refetch}
      />

      {/* In-Store Bespoke Order Creation Modal */}
      <CreateInStoreOrderModal
        isOpen={isInStoreOrderOpen}
        onClose={() => setIsInStoreOrderOpen(false)}
        customerId={customer.id}
        customerName={customer.name}
        measurements={data.measurements || []}
        onOrderCreated={refetch}
      />

      {/* Update Tailoring Milestone Modal */}
      {selectedOrderForStage && (
        <UpdateTailoringStageModal
          isOpen={isUpdateStageOpen}
          onClose={() => {
            setIsUpdateStageOpen(false);
            setSelectedOrderForStage(null);
          }}
          orderId={selectedOrderForStage.id}
          orderNumber={selectedOrderForStage.orderNumber}
          currentStage={selectedOrderForStage.stage}
          currentNotes={selectedOrderForStage.notes}
          onStageUpdated={refetch}
        />
      )}

      {/* Privacy Chat Permission Gate Modal */}
      <ChatPermissionModal
        isOpen={isChatPermissionModalOpen}
        onClose={() => setIsChatPermissionModalOpen(false)}
        buyerId={customer.id}
        customerName={customer.name}
        onProceedToChat={onOpenChat}
      />

      {/* Schedule In-Store Trial Fitting Modal */}
      {selectedOrderForFitting && (
        <ScheduleFittingModal
          isOpen={isFittingModalOpen}
          onClose={() => {
            setIsFittingModalOpen(false);
            setSelectedOrderForFitting(null);
          }}
          orderId={selectedOrderForFitting.id}
          orderNumber={selectedOrderForFitting.orderNumber}
          customerId={customer.id}
          customerName={customer.name}
          onScheduled={refetch}
        />
      )}

      {/* Complete In-Store Garment Handover Modal */}
      {selectedOrderForHandover && (
        <OrderHandoverModal
          isOpen={isHandoverModalOpen}
          onClose={() => {
            setIsHandoverModalOpen(false);
            setSelectedOrderForHandover(null);
          }}
          orderId={selectedOrderForHandover.id}
          orderNumber={selectedOrderForHandover.orderNumber}
          customerName={customer.name}
          totalAmount={selectedOrderForHandover.total}
          paymentStatus={selectedOrderForHandover.paymentStatus}
          onHandoverCompleted={refetch}
        />
      )}
    </div>
  );
}