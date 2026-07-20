import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { productVariants } from "@/db/schema/products/product_variants";

export async function getProductVariantById(variantId: string) {
  return db.query.productVariants.findFirst({
    where: and(
      eq(productVariants.id, variantId),
      isNull(productVariants.deletedAt)
    ),
    with: {
      product: true,
      media: true,
    },
  });
}

export async function getProductVariantBySku(sku: string) {
  return db.query.productVariants.findFirst({
    where: and(
      eq(productVariants.sku, sku),
      isNull(productVariants.deletedAt)
    ),
  });
}
