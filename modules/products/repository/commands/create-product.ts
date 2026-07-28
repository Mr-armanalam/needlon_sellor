import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";

export type CreateProductData = typeof products.$inferInsert;

export async function createProduct(data: CreateProductData) {
  const [product] = await db
    .insert(products)
    .values(data)
    .returning();

  return product;
}
