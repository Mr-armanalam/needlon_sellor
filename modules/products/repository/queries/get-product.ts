import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { productVariantsTable as productVariants } from "@/db/schema/catalog/products/product-variants/table";

export async function getProduct(productId: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product) return null;

  const [category] = product.categoryId
    ? await db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
          description: categoriesTable.description,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, product.categoryId))
        .limit(1)
    : [null];

  const variants = await db
    .select()
    .from(productVariants)
    .where(and(eq(productVariants.productId, productId), isNull(productVariants.deletedAt)));

  return {
    ...product,
    category: category || null,
    variants,
  };
}
