import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";

export type CreateProductData = typeof products.$inferInsert;

export async function createProduct(data: CreateProductData) {
  const sellerId = data.storeId;
  
  if (sellerId) {
    const { sellerStore } = await import("@/db/schema/seller/seller-store");
    const { eq } = await import("drizzle-orm");
    const [existingStore] = await db
      .select()
      .from(sellerStore)
      .where(eq(sellerStore.sellerId, sellerId))
      .limit(1);

    if (!existingStore) {
      const { seller } = await import("@/db/schema/seller");
      const [sellerRecord] = await db
        .select()
        .from(seller)
        .where(eq(seller.id, sellerId))
        .limit(1);
      
      const storeName = sellerRecord?.name ? `${sellerRecord.name} Store` : "Boutique Store";
      const storeSlug = `store-${sellerId.substring(0, 8)}-${Math.random().toString(36).substring(2, 6)}`;
      
      await db.insert(sellerStore).values({
        sellerId,
        storeName,
        storeSlug,
        status: "ACTIVE",
        visibility: "PUBLIC",
      });
    }
  }

  const [product] = await db
    .insert(products)
    .values(data)
    .returning();

  return product;
}
