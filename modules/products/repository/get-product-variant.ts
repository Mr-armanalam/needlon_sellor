import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { productVariantsTable as productVariants } from "@/db/schema/catalog/products/product-variants/table";

export async function getProductVariantById(variantId: string) {
  const [variant] = await db
    .select()
    .from(productVariants)
    .where(and(eq(productVariants.id, variantId), isNull(productVariants.deletedAt)))
    .limit(1);
  return variant ?? null;
}

export async function getProductVariantBySku(sku: string) {
  const [variant] = await db
    .select()
    .from(productVariants)
    .where(and(eq(productVariants.sku, sku), isNull(productVariants.deletedAt)))
    .limit(1);
  return variant ?? null;
}
