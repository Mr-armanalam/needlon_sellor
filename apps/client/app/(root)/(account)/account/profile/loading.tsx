import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-8 space-y-10 animate-in fade-in duration-500">

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-10" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-6">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-10" />
        </div>

        <Skeleton className="h-10 w-80 rounded-md" />
      </div>

      <div className="space-y-4 pb-10">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-5 w-10" />
        </div>

        <Skeleton className="h-10 w-80 rounded-md" />
      </div>
    </div>
  );
}
