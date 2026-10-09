import { Skeleton } from "@/components/ui/skeleton";

export default function CouponsSkeleton() {
  return (
    <div className="px-10 py-8 space-y-10">

      {/* Page Title */}
      <Skeleton className="h-8 w-60" />

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl p-6 h-[360px] shadow-md flex flex-col justify-between"
          >
            {/* Top Text */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />   {/* Discount Title */}
              <Skeleton className="h-4 w-52" />   {/* Description 1 */}
              <Skeleton className="h-4 w-40" />   {/* Description 2 */}

              {/* Hidden code */}
              <div className="flex items-center gap-2 pt-3">
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>

              {/* Validity */}
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Status + Button */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-20 rounded-full" /> {/* Status */}

              {/* Bottom CTA button */}
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        ))}

      </div>

      {/* End Here Text */}
      <div className="flex justify-center py-10">
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}
