import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { productVariantsTable as productVariants } from "@/db/schema/catalog/products/product-variants/table";

export async function getProductVariantById(variantId: string) {
  return db.query.productVariantsTable.findFirst({
    where: and(
      eq(productVariants.id, variantId),
      isNull(productVariants.deletedAt)
    ),
  });
}

export async function getProductVariantBySku(sku: string) {
  return db.query.productVariantsTable.findFirst({
    where: and(
      eq(productVariants.sku, sku),
      isNull(productVariants.deletedAt)
    ),
  });
}
