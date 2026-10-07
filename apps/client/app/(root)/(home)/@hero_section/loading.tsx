import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className=" mx-1 md:mx-6 space-y-4">
      {/* Top category chips */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-2 mt-3 py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 w-24 rounded-full shrink-0"
          />
        ))}
        <Skeleton className="h-8 w-16 rounded-full shrink-0" />
      </div>

      {/* Main hero card */}
      <div className="relative mx-2 bg-stone-100/50 rounded-xl w-full h-50 md:h-105 flex items-center overflow-hidden px-6 md:px-32">
        
        {/* Left side text */}
        <div className="flex flex-col gap-2 md:gap-4 w-full max-w-lg">
          {/* Heading */}
          <Skeleton className="h-10 md:h-12 w-150 rounded-md" />

          {/* Description lines */}
          <Skeleton className="md:h-5 max-md:mt-4 h-3 w-175 rounded-md" />
          <Skeleton className="md:h-5 h-3 w-60 rounded-md" />

          {/* Coupon button */}
          <Skeleton className="h-6 max-md:hidden md:h-10 w-75 rounded-lg mt-2" />
        </div>

        {/* Slider arrows */}
        <Skeleton className="absolute max-md:hidden left-0 top-1/2 -translate-y-1/2 h-40 w-10 rounded-md" />
        <Skeleton className="absolute max-md:hidden right-0 top-1/2 -translate-y-1/2 h-40 w-10 rounded-md" />
      </div>

      {/* Pagination dots */}
      <div className="flex mb-8 justify-center items-center gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-2 w-8 rounded-full" />
        ))}
      </div>
    </div>
  );
}
