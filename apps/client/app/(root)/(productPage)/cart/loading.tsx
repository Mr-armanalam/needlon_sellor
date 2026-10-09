import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 px-20 p-4">
      {/* Left Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="border p-4 rounded-xl space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Cart Item 1 */}
        <div className="flex gap-4 border p-4 rounded-xl">
          <Skeleton className="h-40 w-32 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-28" />
            <div className="flex gap-3 mt-3">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Cart Item 2 */}
        <div className="flex gap-4 border p-4 rounded-xl">
          <Skeleton className="h-40 w-32 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-28" />
            <div className="flex gap-3 mt-3">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="border h-fit p-4 rounded-xl space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
