import { and, eq, isNull, sql, desc, ilike } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products/products";

export interface ListProductsOptions {
  sellerId: string;
  categoryId?: string;
  status?: "DRAFT" | "INCOMPLETE" | "PUBLISHED" | "ARCHIVED";
  search?: string;
  page?: number;
  limit?: number;
}

export async function listProducts(options: ListProductsOptions) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, Math.min(100, options.limit ?? 20));
  const offset = (page - 1) * limit;

  const conditions = [
    eq(products.sellerId, options.sellerId),
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

  const items = await db.query.products.findMany({
    where: whereClause,
    orderBy: [desc(products.createdAt)],
    limit,
    offset,
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
