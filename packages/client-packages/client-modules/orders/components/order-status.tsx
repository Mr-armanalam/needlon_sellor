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

type props = {
  image?: string;
  itemPrice: number;
  size?: string;
  properties?: string;
  itemName: string;
  productId: string;
  orderItemId: string;
  timeline?: any[];
};

const OrderStatus = ({
  image,
  itemPrice,
  size = "s",
  properties,
  itemName,
  productId,
  orderItemId,
  timeline,
}: props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <div className="border dark:bg-white/6 bg-white rounded-sm mt-0.5 mx-1">
      <div className="m-4 flex gap-x-4 ">
        <Link
          href={`/product/${productId}`}
          className="relative h-35 w-32.5"
        >
          {image ? (
            <Image
              className="rounded-md "
              fill
              alt="order_image"
              src={image}
            />
          ) : (
            <div className="bg-white dark:bg-white/6 rounded h-35 w-32.5" />
          )}
        </Link>
        <div>
          <h2 className="text-xl line-clamp-2 dark:text-white text-gray-900 font-semibold">
            {itemName}
          </h2>
          <p className="text-sm">
            {size && `size: ${size}`} {properties}
          </p>
          <p className="font-medium dark:text-white/70 text-stone-700 mt-2">₹ {itemPrice}</p>
          <div className="flex max-md:items-center md:gap-x-6">
            <Button
              onClick={() => router.push(`/product/${productId}`)}
              variant={isMobile ? "link" : "outline"}
              className="rounded-full max-md:pl-0 max-md:hover:underline text-xs md:mt-4 cursor-pointer"
            >
              {isMobile ? "🔺Product" :"View product"}
            </Button>
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
      <Separator orientation="horizontal" className="bg-gray-100 dark:bg-gray-800" />

      <OrderRating isMobile={isMobile} orderItemId={orderItemId} productId={productId} />
    </div>
  );
};

export default OrderStatus;
