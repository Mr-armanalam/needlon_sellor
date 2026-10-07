"use client";

import React from "react";

interface OrderStep {
  title: string;
  date: string;
  details: string[];
  isActive: boolean;
}

const orderSteps: OrderStep[] = [
  {
    title: "Order Confirmed",
    date: "Fri, 24th Oct '25",
    details: [
      "Your Order has been placed. Fri, 24th Oct '25 - 2:51am",
      "Seller has processed your order. Fri, 24th Oct '25 - 9:28pm",
      "Your item has been picked up by delivery partner. Fri, 24th Oct '25 - 9:28pm",
    ],
    isActive: true,
  },
  {
    title: "Shipped",
    date: "Fri, 24th Oct '25",
    details: [
      "Ekart Logistics - FMPC5381317207",
      "Your item has been shipped. Fri, 24th Oct '25 - 9:45pm",
      "Your item has been received in the hub nearest to you",
    ],
    isActive: true,
  },
  {
    title: "Out For Delivery",
    date: "Mon, 27th Oct '25",
    details: ["Your item is out for delivery. Mon, 27th Oct '25 - 9:20am"],
    isActive: true,
  },
  {
    title: "Delivered",
    date: "Mon, 27th Oct '25",
    details: ["Your item has been delivered, Mon, 27th Oct '25 - 4:32pm"],
    isActive: true,
  },
];

export default function OrderTimeline() {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {orderSteps.map((order, i) => (
        <li key={i} className="mb-4 ms-4">
          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mt-4 text-stone-800 dark:text-yellow-700 font-semibold text-ms">
            {order.title}{" "}
            <span className="text-xs italic font-mono font-thin text-gray-500">
              {order.date}
            </span>
          </time>
          <h3 className="text-xs text-stone-700 dark:text-white">
            {order.details[0]}
          </h3>
          {order.details.length > 1 &&
            order.details
              .slice(1, order.details.length - 1)
              .map((details, index) => (
                <p
                  key={index}
                  className="text-xs mb-4 text-gray-500 dark:text-gray-400"
                >
                  {details}
                </p>
              ))}
        </li>
      ))}
    </ol>
  );
}
