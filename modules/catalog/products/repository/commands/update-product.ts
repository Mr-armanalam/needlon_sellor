import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products/products";

export type UpdateProductData = Partial<typeof products.$inferInsert>;

export async function updateProduct(id: string, data: UpdateProductData) {
  const [updated] = await db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return updated ?? null;
}
