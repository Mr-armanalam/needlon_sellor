import { Skeleton } from "@/components/ui/skeleton";

export function PremiumItemSkeleton() {
  return (
    <div className="flex flex-col bg-white h-fit gap-y-3">
      {/* Image */}
      <Skeleton className="xl:aspect-11/16 max-md:h-70 w-full rounded-none xl:w-70" />
      {/* Rating & reviews */}
      <div className="flex gap-y-3 flex-col">
         {/* Title */}
        <Skeleton className="h-5 w-40 mt-2" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
