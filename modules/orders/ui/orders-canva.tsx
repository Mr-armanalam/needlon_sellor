import React, { useState } from 'react';
import { useOrderCanva } from "@/modules/orders/hooks/use-order-canva";
import { DocumentPreviewModal } from "../section/document-preview-modal";
import { BulkManifestModal } from "../section/bulk-manifest-modal";
import HeaderControls from "@/modules/orders/components/header-controls";
import OrderStagesHorizontalTab from "@/modules/orders/section/order-stages-horizontal-tab";
import OrderQueueList from "@/modules/orders/section/order-queue-list";

interface OrdersCanvasProps {
  onInspectOrder: (orderId: string) => void;
}

export default function OrdersCanvas({ onInspectOrder }: OrdersCanvasProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    orders,
    orderTabs,
    loading,
    error,
    deliveryMode,
    setDeliveryMode,
    valueTier,
    setValueTier,
    dateRange,
    setDateRange,
  } = useOrderCanva();

  // Document Modals state
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [selectedPreviewOrder, setSelectedPreviewOrder] = useState<any | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* 1. HEADER CONTROL LAYER */}
      <HeaderControls setIsManifestModalOpen={setIsManifestModalOpen} />

      {/* 2. ORDER STAGES HORIZONTAL TAB TRACK */}
      <OrderStagesHorizontalTab
        orderTabs={orderTabs}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        deliveryMode={deliveryMode}
        setDeliveryMode={setDeliveryMode}
        valueTier={valueTier}
        setValueTier={setValueTier}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* 4. ORDERS QUEUE LIST LAYOUT */}
      <OrderQueueList
        onInspectOrder={onInspectOrder}
        setSelectedPreviewOrder={setSelectedPreviewOrder}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        loading={loading}
        error={error}
        orders={orders}
      />

      {/* Document Preview Modal */}
      {selectedPreviewOrder && (
        <DocumentPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          orderId={selectedPreviewOrder.id}
          orderNumber={selectedPreviewOrder.orderNumber}
          initialTab="INVOICE"
        />
      )}

      {/* Bulk Manifest Generator Modal */}
      {isManifestModalOpen && (
        <BulkManifestModal
          isOpen={isManifestModalOpen}
          onClose={() => setIsManifestModalOpen(false)}
          ordersList={orders}
        />
      )}

    </div>
  );
}