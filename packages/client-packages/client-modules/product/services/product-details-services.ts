import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { productCategory } from "@/db/schema/product-category";
import { productFilterOptions } from "@/db/schema/product-filter-options";
import { filterOptions } from "@/db/schema/filter-options";
import { filterGroups } from "@/db/schema/filter-group";
import { eq } from "drizzle-orm";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

export const ProductDetailService = {
  async getProductBase(productId: string) {
    try {
      const [result] = await db
        .select()
        .from(productItems)
        .where(eq(productItems.id, productId))
        .leftJoin(productCategory, eq(productCategory.id, productItems.categoryId));
      if (result) return result;
    } catch (e) {
      console.warn("DB call failed in getProductBase, returning mock detail:", e);
    }
    const mockP = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    const mockC = MOCK_CATEGORIES.find(c => c.id === mockP.categoryId) || MOCK_CATEGORIES[0];
    return {
      product_items: mockP,
      product_category: mockC
    };
  },

  async getProductFilters(productId: string) {
    try {
      return await db
        .select({
          groupName: filterGroups.name,
          optionValue: filterOptions.value,
        })
        .from(productFilterOptions)
        .where(eq(productFilterOptions.productId, productId))
        .innerJoin(filterOptions, eq(filterOptions.id, productFilterOptions.filterOptionId))
        .innerJoin(filterGroups, eq(filterGroups.id, filterOptions.filterGroupId));
    } catch {
      return [
        { groupName: "Material", optionValue: "100% Cotton" },
        { groupName: "Fit", optionValue: "Slim Fit" },
        { groupName: "Pattern", optionValue: "Solid" }
      ];
    }
  }
};