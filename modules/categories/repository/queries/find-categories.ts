import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema/catalog/category/table";

export async function findCategories() {
  return db
    .select({
      id: categories.id,
      parentId: categories.parentId,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      level: categories.level,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .orderBy(asc(categories.name));
}

export async function findCategoryById(id: string) {
  const [cat] = await db
    .select({
      id: categories.id,
      parentId: categories.parentId,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      level: categories.level,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return cat ?? null;
}

export async function findCategoryBySlug(slug: string) {
  const [cat] = await db
    .select({
      id: categories.id,
      parentId: categories.parentId,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      level: categories.level,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return cat ?? null;
}
