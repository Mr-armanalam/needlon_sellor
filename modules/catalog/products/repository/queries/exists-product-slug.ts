import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products/products";

export async function existsProductSlug(slug: string): Promise<boolean> {
  const result = await db.query.products.findFirst({
    where: and(
      eq(products.slug, slug),
      isNull(products.deletedAt)
    ),
    columns: {
      id: true,
    },
  });

  return Boolean(result);
}
