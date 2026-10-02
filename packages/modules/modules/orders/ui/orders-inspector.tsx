import React, { useState } from "react";
import { DocumentPreviewModal } from "../section/document-preview-modal";
import InspectorSubHeader from "@/modules/orders/section/inspector-sub-header";
import DoubleColumnInspectorLayout from "@/modules/orders/section/double-column-inspector-layout";
import {useOrderInspector} from "@/modules/orders/hooks/use-order-inspector";

interface OrderInspectorProps {
  orderId: string;
  onBack: () => void;
}

export default function OrderInspector({ orderId, onBack }: OrderInspectorProps) {
  const {
      loading,
      error,
      data,
      buyerFirstName,
      formatCurrency,
      currentStatus,
      items,
      deliveryAddress,
      stepsTimeline,
      currentStepIdx,
      handleAdvance,
      isFinalState,
      actionLoading,
      handleCancel
  } = useOrderInspector(orderId);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);


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

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* 1. INSPECTOR SUB-HEADER MODULE */}
      <InspectorSubHeader
        onBack={onBack}
        buyerFirstName={buyerFirstName}
        setIsDocumentModalOpen={setIsDocumentModalOpen}
      />
      {/* 2. DOUBLE-COLUMN INTERACTIVE FULFILLMENT LAYOUT */}
      <DoubleColumnInspectorLayout
        data={data}
        currentStatus={currentStatus}
        items={items}
        formatCurrency={formatCurrency}
        deliveryAddress={deliveryAddress}
        stepsTimeline={stepsTimeline}
        currentStepIdx={currentStepIdx}
        handleAdvance={handleAdvance}
        isFinalState={isFinalState}
        handleCancel={handleCancel}
        actionLoading={actionLoading}
      />
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
