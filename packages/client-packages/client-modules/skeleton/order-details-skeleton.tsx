import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsSkeleton() {
  return (
    <div className="px-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl mb-2 font-garamond font-semibold text-gray-900">
          Order Details
        </h1>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Shipping + Payment + Summary */}
      <div className="bg-[#0e1625] text-white rounded-lg p-6 flex justify-between gap-6">
        {/* Left - Shipping */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-5 w-24" /> {/* Ship to */}
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Middle - Payment */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-5 w-36" /> {/* Payment method */}
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Right - Summary Box */}
        <div className="w-64 bg-gray-600/60 rounded-lg p-4 space-y-3">
          <Skeleton className="h-5 w-32" /> {/* Order Summary */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Product Row */}
      <div className="border rounded-lg p-6 flex gap-6">
        <Skeleton className="h-40 w-32 rounded-md" /> {/* Product image */}
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-60" /> {/* Title */}
          <Skeleton className="h-4 w-24" /> {/* size */}
          <Skeleton className="h-5 w-20" /> {/* Price */}
          <div className="flex gap-4 pt-3">
            <Skeleton className="h-10 w-32 rounded-full" /> {/* View product */}
            <Skeleton className="h-10 w-40 rounded-full" /> {/* Write review */}
          </div>
        </div>
      </div>

      {/* See Updates */}
      <Skeleton className="h-4 w-40" />

      {/* Experience Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
