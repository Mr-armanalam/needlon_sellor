"use client";
import { useParams } from "next/navigation";
import {
  BestSellerResponse,
  Product,
} from "@/types/product";
import Heading from "@/modules/category/section/heading";
import HomePremRecomLike from "@/modules/home/ui/home-prem-recom-like";
import { useQuery } from "@tanstack/react-query";

const NewItemView = ({
  newSectionProducts,
}: {
  newSectionProducts: BestSellerResponse[];
}) => {
  const { type } = useParams<{ type: string }>();

  const { data: products, isLoading } = useQuery({
    queryKey: ["get-new-products"],
    queryFn: async (): Promise<Product> => {
      const res = await fetch(`/api/new-products?category=${type}`, {
        cache: "no-store",
      });
      return res.json();
    },
  });

   const grouped = newSectionProducts.reduce((acc, item) => {
    const key = `${item?.Category?.categoryType!}-${item?.Category?.categoryName!}`.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(item.product);
    return acc;
  }, {} as Record<string, any[]>);
  

  return (
    <>
      <div className="px-8 py-6">
        <Heading productTagDes={products?.productTagDes!} />
      </div>
      <div className="bg-stone-100 dark:bg-white/2 flex flex-col gap-y-2 p-2">
        <div className="md:h-50 h-fit md:px-6 md:py-12 ">
          <div className="rounded-full border-white shadow-sm md:px-12 px-6 flex items-center bg-white dark:bg-white/5 dark:text-white w-full h-full">
            <h1 className="text-stone-600 max-md:py-2 max-md:line-clamp-2 dark:text-white md:text-xl font-garamond font-bold">
              Select an Items which reperesent your choice !
            </h1>
          </div>
        </div>

        {grouped["men-formal"] && (
          <HomePremRecomLike
            heading="Men's Formalwear"
            items={grouped["men-formal"]}
            navigateTo="/new-in"
          />
        )}

        {grouped["men-outerwears"] && (
          <HomePremRecomLike
            heading="Men's Outerwear"
            items={grouped["men-outerwears"]}
            navigateTo="/new-in"
          />
        )}

        {grouped["women-formal"] && (
          <HomePremRecomLike
            heading="Women's Formalwear"
            items={grouped["women-formal"]}
            navigateTo="/new-in"
          />
        )}
        {grouped["women-outerwears"] && (
          <HomePremRecomLike
            heading="Women's Outerwear"
            items={grouped["women-outerwears"]}
            navigateTo="/new-in"
          />
        )}
      </div>
    </>
  );
};

export default NewItemView;


