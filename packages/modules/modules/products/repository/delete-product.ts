import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";

export async function deleteProduct(id: string, sellerId?: string) {
  const [deleted] = await db
    .update(products)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
      ...(sellerId ? { updatedBy: sellerId } : {}),
    })
    .where(eq(products.id, id))
    .returning();

  return deleted ?? null;
}
