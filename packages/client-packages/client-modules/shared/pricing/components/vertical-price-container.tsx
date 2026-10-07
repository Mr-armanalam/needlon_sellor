import { cn } from "@/lib/utils";
import React from "react";

const VerticalPriceContainer = ({
  category,
  categoryPriceData,
}: {
  category: string;
  categoryPriceData: { type: string; price: number }[];
}) => {
  return (
    <div className="bg-white rounded-sm p-8 border border-gray-200 dark:bg-white/1 dark:border-white/3">
      <h3
        className="text-[#D4AF37] text-xl mb-6"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {category}
      </h3>
      <div className="space-y-3">
        {categoryPriceData.map((item, i) => (
          <div
            key={i}
            className={cn(
              categoryPriceData.length - 1 !== i && "border-b border-gray-200 dark:border-white/3 pb-3",
              "flex justify-between items-start"
            )}
          >
            <span className="text-gray-600 dark:text-gray-400 text-sm">{item.type}</span>
            <span className="text-[#1A1D2E] dark:text-gray-500 text-sm">₹{item.price} and up</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalPriceContainer;
