import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productVariants } from "@/db/schema/products/product_variants";

export type UpdateProductVariantData = Partial<typeof productVariants.$inferInsert>;

export async function updateProductVariant(id: string, data: UpdateProductVariantData) {
  const [updated] = await db
    .update(productVariants)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(productVariants.id, id))
    .returning();

  return updated ?? null;
}
