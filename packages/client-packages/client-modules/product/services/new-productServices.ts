import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { productCategory } from "@/db/schema/product-category";
import { eq, desc, ilike } from "drizzle-orm";
import { getMockProductsWithCategory } from "@/lib/mock-data-provider";

export const NewProductService = {
  /**
   * Fetches products joined with category info based on category slug
   */
  async getByCategory(catslug: string) {
    try {
      const res = await db
        .select({
          product: productItems,
          category: productCategory,
        })
        .from(productItems)
        .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
        .where(ilike(productCategory.CatType, catslug))
        .orderBy(desc(productItems.createdAt));

      return res.length ? res : getMockProductsWithCategory();
    } catch {
      console.warn("DB failed in NewProductService.getByCategory, returning mock");
      return getMockProductsWithCategory();
    }
  }
};