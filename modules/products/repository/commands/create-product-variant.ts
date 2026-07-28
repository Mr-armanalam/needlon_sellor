import { db } from "@/db";
import { productVariantsTable as productVariants } from "@/db/schema/catalog/products/product-variants/table";

export type CreateProductVariantData = typeof productVariants.$inferInsert;

export async function createProductVariant(data: CreateProductVariantData) {
  const [variant] = await db
    .insert(productVariants)
    .values(data)
    .returning();

  return variant;
}
