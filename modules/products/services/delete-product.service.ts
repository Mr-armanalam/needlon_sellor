import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";

export async function deleteProductService(productId: string) {
  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!existing) {
    throw new Error(`Product with ID "${productId}" not found.`);
  }

  // If already soft deleted or archived with deletedAt set, perform permanent deletion
  if (existing.deletedAt) {
    await db.delete(products).where(eq(products.id, productId));
    return { ...existing, id: productId, status: "DELETED" };
  }

  // Soft delete
  const [deleted] = await db
    .update(products)
    .set({
      deletedAt: new Date(),
      status: "ARCHIVED",
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning();

  return deleted ?? { ...existing, deletedAt: new Date() };
}
