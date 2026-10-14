"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import OrderTimeline from "./order-timeline";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OrderRating from "../ui/order-rating";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import MeasurementModal from "./measurement-modal";
import { Scissors, Play } from "lucide-react";

type props = {
  image?: string;
  itemPrice: number;
  size?: string;
  properties?: string;
  itemName: string;
  productId: string;
  orderItemId: string;
  timeline?: any[];
  hasMeasurement?: boolean;
  measurementData?: any;
  rawOrderId?: string;
  orderId?: string;
  mediaUrls?: string[];
};

const OrderStatus = ({
  image,
  itemPrice,
  size,
  properties,
  itemName,
  productId,
  orderItemId,
  timeline,
  hasMeasurement,
  measurementData,
  rawOrderId,
  orderId,
  mediaUrls,
}: props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = React.useState(false);

  const formattedProperties = (() => {
    if (properties && size) {
      if (properties.toLowerCase().includes(size.toLowerCase())) {
        return properties;
      }
      return `Size: ${size} • ${properties}`;
    }
    if (properties) return properties;
    if (size) return `Size: ${size}`;
    return null;
  })();

  const activeImage = image || (mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : null);
  const isVideo = Boolean(activeImage && (activeImage.includes('.mp4') || activeImage.includes('.webm') || activeImage.startsWith('data:video')));
  const isCustomProduct = !productId || productId.startsWith('prod-custom') || productId.startsWith('BESPOKE');

  const mediaThumbnail = (
    <div className="relative h-35 w-32.5 shrink-0 overflow-hidden rounded-md">
      {activeImage ? (
        isVideo ? (
          <video src={activeImage} className="rounded-md w-full h-full object-cover bg-black" controls muted />
        ) : (
          <img
            className="rounded-md object-cover w-full h-full"
            alt="order_image"
            src={activeImage}
          />
        )
      ) : (
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md h-full w-full flex flex-col items-center justify-center text-center p-2 border border-neutral-200 dark:border-neutral-700">
          <Scissors className="w-6 h-6 text-neutral-500 mb-1" />
          <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-tight">
            Bespoke Atelier
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="border dark:bg-white/6 bg-white rounded-sm mt-0.5 mx-1">
      <div className="m-4 flex gap-x-4 ">
        {isCustomProduct ? (
          mediaThumbnail
        ) : (
          <Link href={`/product/${productId}`}>
            {mediaThumbnail}
          </Link>
        )}
        <div>
          <h2 className="text-xl line-clamp-2 dark:text-white text-gray-900 font-semibold">
            {itemName}
          </h2>
          {formattedProperties && (
            <p className="text-sm dark:text-stone-300 text-stone-600">
              {formattedProperties}
            </p>
          )}
          <p className="font-medium dark:text-white/70 text-stone-700 mt-2">₹ {itemPrice}</p>
          <div className="flex max-md:items-center md:gap-x-6">
            {hasMeasurement && measurementData ? (
              <Button
                onClick={() => setIsMeasurementModalOpen(true)}
                variant={isMobile ? "link" : "outline"}
                className="rounded-full max-md:pl-0 max-md:hover:underline text-xs md:mt-4 cursor-pointer text-blue-600 dark:text-blue-400 font-semibold"
              >
                {isMobile ? "📏Measurements" : "View Measurements"}
              </Button>
            ) : (
              <Button
                onClick={() => router.push(`/product/${productId}`)}
                variant={isMobile ? "link" : "outline"}
                className="rounded-full max-md:pl-0 max-md:hover:underline text-xs md:mt-4 cursor-pointer"
              >
                {isMobile ? "🔺Product" : "View product"}
              </Button>
            )}
            <div className="w-px h-4 md:hidden bg-stone-700" />
            <Button variant={isMobile ? "link" : "default"} className="rounded-full text-xs md:mt-4 cursor-pointer">
              {isMobile ? "🖋️ Review" : "write a product review"}
            </Button>
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" className="bg-gray-100 dark:bg-gray-800" />
      <div className="px-4">
        <Accordion
          type="single"
          collapsible
          className="w-full bg-whit rounded-md"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold cursor-pointer text-blue-700">
              See All Updates -&gt;
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white dark:bg-black rounded-md mb-4">
              <OrderTimeline steps={timeline} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {mediaUrls && mediaUrls.length > 0 && (
        <div className="px-4 pb-3">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              <Scissors className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Tailor Atelier Craft & Progress Media ({mediaUrls.length})</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Craftsmanship photos, fabric preparation, and swinging movement videos from the atelier
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
              {mediaUrls.map((url: string, idx: number) => {
                const isVid = url.includes('.mp4') || url.includes('.webm') || url.startsWith('data:video');
                return (
                  <div key={idx} className="relative rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-black aspect-video flex items-center justify-center">
                    {isVid ? (
                      <video src={url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt={`Craft ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Separator orientation="horizontal" className="bg-gray-100 dark:bg-gray-800" />

      <OrderRating isMobile={isMobile} orderItemId={orderItemId} productId={productId} />

      {hasMeasurement && measurementData && (
        <MeasurementModal
          isOpen={isMeasurementModalOpen}
          onClose={() => setIsMeasurementModalOpen(false)}
          measurement={measurementData}
          orderId={rawOrderId || orderItemId}
          orderNumber={orderId}
        />
      )}
    </div>
  );
};

export default OrderStatus;
