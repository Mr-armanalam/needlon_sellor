import { PremiumItemSkeleton } from "@/modules/shared/product-items/HomePremiumItemSkeleton";


export default function PremiumItemsLoading() {
  return (
    <div className=" bg-stone-100 md:p-2">
      <div className="bg-white rounded-sm p-3 md:p-6 w-full">
        <h2 className="text-3xl font-garamond mb-4">Premium Items</h2>
        <div className="md:flex max-md:grid max-md:grid-cols-2 gap-4 no-scrollbar xl:overflow-x-auto py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <PremiumItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
