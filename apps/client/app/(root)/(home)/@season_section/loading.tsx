import { Skeleton } from "@/components/ui/skeleton";

export function SeasonCardSkeleton() {
  return (
    <div className="w-[300px] h-[470px] rounded-2xl bg-[#071019] shadow-md overflow-hidden flex flex-col">
      
      {/* TOP IMAGE BLOCK */}
      <div className="p-4">
        <div className="bg-[#0F1A27] rounded-2xl w-full h-[230px] flex items-center justify-center">
          <Skeleton className="w-[80%] h-[80%] rounded-xl" />
        </div>
      </div>

      {/* DIAGONAL DIVIDER */}
      <div className="w-full h-5 bg-[#071019] -mt-2"
        style={{
          clipPath: "polygon(0 0, 100% 20%, 100% 100%, 0% 100%)",
        }}
      />

      {/* CONTENT AREA */}
      <div className="px-5 flex flex-col gap-3 mt-3">
        
        {/* Rating section */}
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-5 w-36" />

        {/* Price */}
        <Skeleton className="h-5 w-20" />

        {/* Description */}
        <Skeleton className="h-4 w-56" />
      </div>

      {/* BOTTOM ICON */}
      <div className="p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export default function SeasonSectionSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-stone-100 flex flex-col items-center gap-4 py-10">
      {/* Title */}
      <Skeleton className="h-7 bg-white w-48" />
      <Skeleton className="h-4 bg-white w-80" />

      {/* Card list */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-6 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SeasonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
