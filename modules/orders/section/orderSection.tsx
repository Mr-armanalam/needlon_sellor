'use client'
import React, { useState } from "react";
import OrdersCanvas from "../view/orders-canva";
import OrderInspector from "../view/orders-inspector";

export default function OrdersPage() {
  // View mode switcher state: 'queue' (main grid) or 'inspect' (individual detail timeline)
  const [viewMode, setViewMode] = useState<"queue" | "inspect">("queue");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleInspectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setViewMode("inspect");
  };

  const handleBackToQueue = () => {
    setViewMode("queue");
    setSelectedOrderId(null);
  };

  return (
    <div className="w-full min-h-full bg-[#FAFAFA]">
      {/* CORE WRAPPER BOUNDING BOX CONTAINER */}
      {viewMode === "queue" ? (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
          <OrdersCanvas onInspectOrder={handleInspectOrder} />
        </div>
      ) : (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
          <OrderInspector orderId={selectedOrderId!} onBack={handleBackToQueue} />
        </div>
      )}
    </div>
  );
}
