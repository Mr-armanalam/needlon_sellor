import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { productCategory } from "@/db/schema/product-category";
import { orderItems } from "@/db/schema/order-items";
import { eq, desc, inArray, ilike, or, sql, aliasedTable } from "drizzle-orm";
import { productFilterOptions } from "@/db/schema/product-filter-options";
import { filterOptions } from "@/db/schema/filter-options";
import { getMockProductsWithCategory } from "@/lib/mock-data-provider";

export const ProductService = {
  // Standard Row Selection to keep DRY (Don't Repeat Yourself)
  baseSelect: {
    product: productItems,
    category: productCategory,
  },

  async getPremium() {
    try {
      const res = await db.select(this.baseSelect)
        .from(productItems)
        .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
        .where(eq(productItems.isPremium, true));
      return res.length ? res : getMockProductsWithCategory().filter(p => p.product.isPremium);
    } catch {
      return getMockProductsWithCategory().filter(p => p.product.isPremium);
    }
  },

  async getTrending() {
    try {
      const res = await db.select(this.baseSelect)
        .from(productItems)
        .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
        .innerJoin(orderItems, eq(orderItems.productId, productItems.id))
        .groupBy(productItems.id, productCategory.id)
        .orderBy(desc(sql`count(*)`))
        .limit(10);
      return res.length ? res : getMockProductsWithCategory();
    } catch {
      return getMockProductsWithCategory();
    }
  },

  async getNewArrivals(limit = 12) {
    try {
      const res = await db.select(this.baseSelect)
        .from(productItems)
        .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
        .orderBy(desc(productItems.createdAt))
        .limit(limit);
      return res.length ? res : getMockProductsWithCategory().slice(0, limit);
    } catch {
      return getMockProductsWithCategory().slice(0, limit);
    }
  },

  async getByCategory(dbValue: string, dynamicFilters: Record<string, string>) {
    try {
      let query = db.select(this.baseSelect)
        .from(productItems)
        .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
        .where(
          or(
            ilike(productCategory.CatType, dbValue),
            ilike(productCategory.SubCatType, dbValue)
          )
        ).$dynamic();

      for (const [key, value] of Object.entries(dynamicFilters)) {
        const optionAlias = aliasedTable(productFilterOptions, `filter_${key}`);
        const metaAlias = aliasedTable(filterOptions, `meta_${key}`);
        query = query
          .innerJoin(optionAlias, eq(productItems.id, optionAlias.productId))
          .innerJoin(metaAlias, eq(optionAlias.filterOptionId, metaAlias.id))
          .where(eq(metaAlias.slug, value));
      }
      const res = await query;
      if (res.length) return res;
    } catch { /* fall through */ }

    // Filter mock by category type
    return getMockProductsWithCategory().filter(p =>
      p.category.CatType.toLowerCase().includes(dbValue.toLowerCase()) ||
      p.category.SubCatType.toLowerCase().includes(dbValue.toLowerCase())
    ).slice(0, 12) || getMockProductsWithCategory();
  }
};