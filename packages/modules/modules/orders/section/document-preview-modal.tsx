"use client";

import React from "react";
import {useDocumentPreview} from "@/modules/orders/hooks/use-document-preview";
import {initial_tab} from "@/modules/orders/types";
import OrderRecieptPreviewHeaderToolbar from "@/modules/orders/components/order-reciept-preview-header-toolbar";
import OrderRecieptPreviewContentViewport from "@/modules/orders/components/order-reciept-preview-content-viewport";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  initialTab?: initial_tab;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  initialTab = "INVOICE",
}: DocumentPreviewModalProps) {

  const {
      activeTab,
      setActiveTab,
      error,
      zoom,
      loading,
      setZoom,
      handlePrint,
      handleDownload,
      htmlContent
  } = useDocumentPreview({ isOpen, orderId, initialTab, orderNumber });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-neutral-200/80 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Toolbar */}
        <OrderRecieptPreviewHeaderToolbar
            onClose={onClose}
            orderNumber={orderNumber}
            handleDownload={handleDownload}
            handlePrint={handlePrint}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            zoom={zoom}
            setZoom={setZoom}
            loading={loading}
            error={error}
        />
        {/* Content Viewport */}
        <OrderRecieptPreviewContentViewport
            loading={loading}
            error={error}
            zoom={zoom}
            activeTab={activeTab}
            htmlContent={htmlContent}
        />
      </div>
    </div>
  );
}
