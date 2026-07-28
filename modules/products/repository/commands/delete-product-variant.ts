import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productVariantsTable as productVariants } from "@/db/schema/catalog/products/product-variants/table";

export async function deleteProductVariant(id: string) {
  const [deleted] = await db
    .update(productVariants)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(productVariants.id, id))
    .returning();

  return deleted ?? null;
}
