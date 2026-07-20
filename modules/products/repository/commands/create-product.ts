import { db } from "@/db";
import { products } from "@/db/schema/products/products";

export type CreateProductData = typeof products.$inferInsert;

export async function createProduct(data: CreateProductData) {
  const [product] = await db
    .insert(products)
    .values(data)
    .returning();

  return product;
}
