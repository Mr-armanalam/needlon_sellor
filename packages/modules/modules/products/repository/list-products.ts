import { and, eq, isNull, sql, desc, ilike } from "drizzle-orm";
import { db } from "@/db";
import { productsTable as products } from "@/db/schema/catalog/products/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { productVariantsTable as productVariants } from "@/db/schema/catalog/products/product-variants/table";
import { ProductStatus } from "../types";

export interface ListProductsOptions {
  sellerId: string;
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export async function listProducts(options: ListProductsOptions) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, Math.min(100, options.limit ?? 20));
  const offset = (page - 1) * limit;

  const conditions = [
    eq(products.storeId, options.sellerId),
    isNull(products.deletedAt),
  ];

  if (options.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }

  if (options.status) {
    conditions.push(eq(products.status, options.status));
  }

  if (options.search) {
    conditions.push(ilike(products.name, `%${options.search}%`));
  }

  const whereClause = and(...conditions);

  const rawProducts = await db
    .select()
    .from(products)
    .where(whereClause)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  const items = await Promise.all(
    rawProducts.map(async (p) => {
      const [cat] = p.categoryId
        ? await db
            .select({
              id: categoriesTable.id,
              name: categoriesTable.name,
              slug: categoriesTable.slug,
              description: categoriesTable.description,
            })
            .from(categoriesTable)
            .where(eq(categoriesTable.id, p.categoryId))
            .limit(1)
        : [null];

      const vars = await db
        .select()
        .from(productVariants)
        .where(and(eq(productVariants.productId, p.id), isNull(productVariants.deletedAt)));

      return {
        ...p,
        category: cat || null,
        variants: vars,
      };
    })
  );

  const [totalResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(whereClause);

  const total = totalResult?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
