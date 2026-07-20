import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products/products";

export async function deleteProduct(id: string) {
  const [deleted] = await db
    .update(products)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return deleted ?? null;
}
