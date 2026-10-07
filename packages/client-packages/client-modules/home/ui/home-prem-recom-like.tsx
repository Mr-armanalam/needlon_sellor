'use client'

// A shared component which is common for premium, recommendation, you may like section in a home page

import { Button } from "@/components/ui/button";
import ProductCardPreview from "../components/card/item-card";
import { ClientProductItem } from "@/types/product";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";


const HomePremRecomLike = ({heading, items, navigateTo}:{heading: string, items:ClientProductItem[], navigateTo: string}) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  // console.log(items, 'item');
  
  return (
    <div className="bg-white px-0.5 xl:px-4 dark:bg-black">
      <h1 className="pt-6 px-2 text-2xl xl:text-5xl font-garamond text-gray-950/90 dark:text-white">
        {heading}
      </h1>
      <div className="xl:flex max-sm:grid max-sm:grid-cols-2 xl:overflow-auto px-3 gap-2 xl:gap-x-4 py-8 rounded-sm no-scrollbar relative">
        {items?.length > 0 && items.map((i, k) => (
          <ProductCardPreview
            key={k}
            item={i}
          />
        ))}
        <Button
          type="button"
          variant={isMobile ? 'outline': 'default'}
          onClick={() => router.push(navigateTo) }
          className="my-auto -right-6 sticky max-md:text-xs md:text-2xl px-2.5 xl:rounded-r-none max-sm:bg-none max-sm:border dark:bg-zinc-900/70  dark:border dark:text-white cursor-pointer max-sm:w-30 xl:w-11 xl:h-30"
        >
          {isMobile ? "Explore more" : ">"}
        </Button>
      </div>
    </div>
  );
};

export default HomePremRecomLike;
