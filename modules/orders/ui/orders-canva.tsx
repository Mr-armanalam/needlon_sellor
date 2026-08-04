import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, MessageSquare, ArrowRight, Printer } from 'lucide-react';
import { fetchOrdersClient } from '../api/order-client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DocumentPreviewModal } from "../section/document-preview-modal";
import { BulkManifestModal } from "../section/bulk-manifest-modal";
import {DATE_RANGES, DELIVERY_MODES, VALUE_TIERS} from "@/modules/orders/constants";
import HeaderControls from "@/modules/orders/components/header-controls";
import OrderStagesHorizontalTab from "@/modules/orders/section/order-stages-horizontal-tab";
import OrderQueueList from "@/modules/orders/section/order-queue-list";

interface OrdersCanvasProps {
  onInspectOrder: (orderId: string) => void;
}

export default function OrdersCanvas({ onInspectOrder }: OrdersCanvasProps) {

  // Document Modals state
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [selectedPreviewOrder, setSelectedPreviewOrder] = useState<any | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);



  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* 1. HEADER CONTROL LAYER */}
      <HeaderControls setIsManifestModalOpen={setIsManifestModalOpen} />

      {/* 2. ORDER STAGES HORIZONTAL TAB TRACK */}
      <OrderStagesHorizontalTab />

      {/* 4. ORDERS QUEUE LIST LAYOUT */}
     <OrderQueueList
        onInspectOrder={onInspectOrder}
        setSelectedPreviewOrder={setSelectedPreviewOrder}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
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
      <BulkManifestModal
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
      />

    </div>
  );
}