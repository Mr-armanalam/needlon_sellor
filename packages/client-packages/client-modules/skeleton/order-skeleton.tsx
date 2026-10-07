import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersSkeleton() {
  return (
    <div className="w-full px-8 space-y-10">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold mr-auto">Your Orders</h1>

        <Skeleton className="h-10 w-[300px] rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b pb-8">
          <Skeleton className="h-40 w-32 rounded-md" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />

            <div className="flex gap-4 pt-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
            </div>
          </div>

          <div className="flex justify-end items-start">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}
