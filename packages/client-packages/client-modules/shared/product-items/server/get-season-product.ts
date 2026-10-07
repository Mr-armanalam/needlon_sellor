import { db } from "@/db";
import { filterOptions } from "@/db/schema/filter-options";
import { productFilterOptions } from "@/db/schema/product-filter-options";
import { productItems } from "@/db/schema/product-items";
import { eq } from "drizzle-orm";
import { getMockSeasonProducts } from "@/lib/mock-data-provider";

export const getSeasonProduct = async ({
  seasonType = "casual",
}: {
  seasonType?: string;
}) => {
  try {
    const [filterOptionData] = await db
      .select({ id: filterOptions.id })
      .from(filterOptions)
      .where(eq(filterOptions.slug, seasonType));

    if (!filterOptionData) return getMockSeasonProducts(seasonType);

    const data = await db
      .select({
        seasonProduct: productItems,
      })
      .from(productFilterOptions)
      .innerJoin(
        productItems,
        eq(productItems.id, productFilterOptions.productId)
      )
      .where(eq(productFilterOptions.filterOptionId, filterOptionData.id));
    
    if (!data || data.length === 0) return getMockSeasonProducts(seasonType);
    return data;
  } catch (error) {
    console.warn("DB failed in getSeasonProduct, using mock fallback:", error);
    return getMockSeasonProducts(seasonType);
  }
};

