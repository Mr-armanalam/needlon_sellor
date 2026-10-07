import { Skeleton } from "@/components/ui/skeleton";

export function WishlistItemSkeleton() {
  return (
    <div className="px-6">
      <Skeleton className="w-32 h-12 rounded-md" />
      <div className="flex flex-col no-scrollbar gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full border-b py-6">
            <div className="flex gap-5">
              <Skeleton className="w-32 h-32 rounded-md" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-20 mb-3" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
              <div className="hidden md:flex items-start">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
