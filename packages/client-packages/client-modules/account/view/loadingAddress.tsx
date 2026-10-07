import { Skeleton } from "@/components/ui/skeleton";

export default function AddressSkeleton() {
  return (
    <div className="w-full mt-4 space-y-4">
      <div className="border rounded-md p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-6" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="border rounded-md p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-6" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
