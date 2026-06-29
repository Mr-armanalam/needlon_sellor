'use client'
import React, { useState } from "react";
import OrdersCanvas from "../view/orders-canva";
import OrderInspector from "../view/orders-inspector";

export default function OrdersPage() {
  // View mode switcher state: 'queue' (main grid) or 'inspect' (individual detail timeline)
  const [viewMode, setViewMode] = useState<"queue" | "inspect">("queue");

  return (
    <div className="w-full min-h-full bg-[#FAFAFA]">
      {/* CORE WRAPPER BOUNDING BOX CONTAINER */}
      {viewMode === "queue" ? (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
          {/* Main List Row Interceptor - triggers state view change upon clicking Inspect */}
          <div
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (
                target
                  .closest("button")
                  ?.textContent?.includes("Inspect Details")
              ) {
                setViewMode("inspect");
              }
            }}
          >
            <OrdersCanvas />
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
          {/* Main Inspection Deck Injector */}
          {/* Intercept the 'Back to Orders Queue' action to safely return to the full summary stream */}
          <div
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (
                target
                  .closest("button")
                  ?.textContent?.includes("Back to Orders Queue")
              ) {
                setViewMode("queue");
              }
            }}
          >
            <OrderInspector />
          </div>
        </div>
      )}
    </div>
  );
}
