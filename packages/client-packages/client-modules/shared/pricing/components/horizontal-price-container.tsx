import { cn } from "@/lib/utils";
import React from "react";

const HorizontalPriceContainer = ({
  category,
  categoryPriceData,
}: {
  category?: string | null;
  categoryPriceData: { type: string; price: number }[];
}) => {
  return (
    <div className="bg-white rounded-sm p-8 border border-gray-200 lg:col-span-2 dark:bg-white/1 dark:border-white/3">
      {category && (
        <h3
          className="text-[#D4AF37] text-xl mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {category}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {categoryPriceData.map((data, k) => (
          <div
            key={k}
            className={cn(
              categoryPriceData.length - 1 === k
                ? "md:col-span-2"
                : "border-b border-gray-200 dark:border-white/3 pb-3",
              "flex justify-between items-start "
            )}
          >
            <span className="text-gray-600 dark:text-gray-400 text-sm">{data.type}</span>
            <span className="text-[#1A1D2E] dark:text-gray-500 text-sm">₹{data.price} and up</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalPriceContainer;
