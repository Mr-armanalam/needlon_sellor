import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products/products";

export async function getProduct(productId: string) {
  return db.query.products.findFirst({
    where: and(
      eq(products.id, productId),
      isNull(products.deletedAt)
    ),
    with: {
      category: {
        columns: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
      variants: {
        where: isNull(products.deletedAt),
      },
      media: true,
    },
  });
}
