import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";

export async function existsProductSlug(slug: string): Promise<boolean> {
  const [result] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.slug, slug), isNull(products.deletedAt)))
    .limit(1);

  return Boolean(result);
}

