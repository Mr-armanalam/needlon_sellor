import { db } from "@needlon/db";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { categoryAttributesTable } from "@needlon/db/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@needlon/db/db/schema/catalog/category-attribute-options";
import { productAttributeValuesTable } from "@needlon/db/db/schema/catalog/products/product-attribute-values/table";
import { eq, and, desc, asc, sql, ilike } from "drizzle-orm";

export interface QueryProductsParams {
  categorySlug?: string;
  categoryType?: string;
  subcatSlug?: string;
  limit?: number;
  offset?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "popular";
  isFeatured?: boolean;
}

export const ProductRepository = {
  async getProducts(params: QueryProductsParams = {}) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const { limit = 20, offset = 0, sort = "newest", categorySlug, isFeatured } = params;

      const conditions: any[] = [
        eq(productsTable.status, "PUBLISHED"),
        eq(productsTable.visibility, "PUBLIC"),
      ];

      if (isFeatured !== undefined) {
        conditions.push(eq(productsTable.isFeatured, isFeatured));
      }

      if (categorySlug) {
        conditions.push(ilike(categoriesTable.slug, `%${categorySlug}%`));
      }

      const rows = await db
        .select({
          product: productsTable,
          category: categoriesTable,
          defaultVariant: productVariantsTable,
          pricing: pricingTable,
        })
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .leftJoin(
          productVariantsTable,
          eq(productsTable.id, productVariantsTable.productId)
        )
        .leftJoin(
          pricingTable,
          eq(productVariantsTable.id, pricingTable.variantId)
        )
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);

      return rows;
    } catch (error) {
      console.warn("ProductRepository.getProducts fallback:", (error as Error).message);
      return [];
    }
  },

  async getProductById(productId: string) {
    if (!process.env.DATABASE_URL) return null;

    try {
      const [record] = await db
        .select({
          product: productsTable,
          category: categoriesTable,
        })
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(eq(productsTable.id, productId))
        .limit(1);

      return record ?? null;
    } catch (error) {
      console.warn("ProductRepository.getProductById fallback:", (error as Error).message);
      return null;
    }
  },

  async getProductVariants(productId: string) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const variants = await db
        .select({
          variant: productVariantsTable,
          pricing: pricingTable,
          inventory: inventoryTable,
        })
        .from(productVariantsTable)
        .leftJoin(pricingTable, eq(productVariantsTable.id, pricingTable.variantId))
        .leftJoin(inventoryTable, eq(productVariantsTable.id, inventoryTable.variantId))
        .where(eq(productVariantsTable.productId, productId));

      return variants;
    } catch (error) {
      console.warn("ProductRepository.getProductVariants fallback:", (error as Error).message);
      return [];
    }
  },

  async getProductImages(productId: string) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const media = await db
        .select()
        .from(productImagesTable)
        .where(eq(productImagesTable.productId, productId))
        .orderBy(asc(productImagesTable.displayOrder));

      return media;
    } catch (error) {
      console.warn("ProductRepository.getProductImages fallback:", (error as Error).message);
      return [];
    }
  },

  async getProductAttributes(productId: string) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const attributes = await db
        .select({
          groupName: categoryAttributesTable.name,
          optionValue: sql<string>`coalesce(${categoryAttributeOptionsTable.label}, ${productAttributeValuesTable.valueText})`,
        })
        .from(productAttributeValuesTable)
        .leftJoin(
          categoryAttributesTable,
          eq(productAttributeValuesTable.attributeId, categoryAttributesTable.id)
        )
        .leftJoin(
          categoryAttributeOptionsTable,
          eq(productAttributeValuesTable.attributeOptionId, categoryAttributeOptionsTable.id)
        )
        .where(eq(productAttributeValuesTable.productId, productId));

      return attributes;
    } catch (error) {
      console.warn("ProductRepository.getProductAttributes fallback:", (error as Error).message);
      return [];
    }
  },
};
