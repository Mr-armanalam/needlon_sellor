import { db } from "@/db";
import { productVariants } from "@/db/schema/products/product_variants";

export type CreateProductVariantData = typeof productVariants.$inferInsert;

export async function createProductVariant(data: CreateProductVariantData) {
  const [variant] = await db
    .insert(productVariants)
    .values(data)
    .returning();

  return variant;
}
