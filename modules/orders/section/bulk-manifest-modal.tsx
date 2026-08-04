"use client";

import {useManifest} from "@/modules/orders/hooks/use-manifest";
import BulkManifestDocHeader from "@/modules/orders/components/bulk-manifest-doc-header";
import BulkManifestDocCourierNDate from "@/modules/orders/components/bulk-manifest-doc-courier-n-date";
import BulkManifestDocSelectOrder from "@/modules/orders/components/bulk-manifest-doc-select-order";
import BulkManifestDocHtmlPreview from "@/modules/orders/components/bulk-manifest-doc-html-preview";
import BulkManifestDocFooterAction from "@/modules/orders/components/bulk-manifest-doc-footer-action";

interface BulkManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordersList: any[];
}

export function BulkManifestModal({
  isOpen,
  onClose,
  ordersList,
}: BulkManifestModalProps) {
  const {
    manifestNumber,
      manifestHtml,
      setManifestHtml,
      selectedOrderIds,
      courierName,
      pickupDate,
      setCourierName,
      setPickupDate,
      loading,
      error,
      toggleSelectAll,
      toggleSelectOrder,
      handleGenerateManifest,
      handlePrintManifest
  } = useManifest(ordersList);
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-neutral-200/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <BulkManifestDocHeader
            manifestHtml={manifestHtml}
            manifestNumber={manifestNumber}
            onClose={onClose}
        />
        {/* Content */}
        {manifestHtml ? (
            <BulkManifestDocHtmlPreview
                manifestHtml={manifestHtml}
                handlePrintManifest={handlePrintManifest}
                setManifestHtml={setManifestHtml}
            />
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {/* Courier & Date Form */}
            <BulkManifestDocCourierNDate
                courierName={courierName}
                pickupDate={pickupDate}
                setPickupDate={setPickupDate}
                setCourierName={setCourierName}
            />

            {/* Orders Selection List */}
            <BulkManifestDocSelectOrder
              selectedOrderIds={selectedOrderIds}
              ordersList={ordersList}
              toggleSelectAll={toggleSelectAll}
              error={error}
              toggleSelectOrder={toggleSelectOrder}
            />
            {/* Footer Action */}
            <BulkManifestDocFooterAction
                onClose={onClose}
                handleGenerateManifest={handleGenerateManifest}
                selectedOrderIds={selectedOrderIds}
                loading={loading}
            />
          </div>
        )}

      </div>
    </div>
  );
}
