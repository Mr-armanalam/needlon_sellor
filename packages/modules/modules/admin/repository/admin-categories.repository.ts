import { asc, count, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { productsTable } from "@/db/schema/catalog/products/table";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { slugifyText } from "../../shared/slug/slugify";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/admin.dto";

type CategoryRow = typeof categoriesTable.$inferSelect;

/**
 * Admin category management over the storefront `categories` table.
 * The table is an adjacency list with a materialised `path` and cached
 * `level`/`isLeaf` — every mutation here re-derives those fields for the
 * whole tree so they can never drift from the parent links.
 */

async function assertSlugAndCodeFree(
  slug: string,
  code: string,
  excludeId?: string,
): Promise<void> {
  const rows = await db
    .select({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      code: categoriesTable.code,
    })
    .from(categoriesTable);
  for (const row of rows) {
    if (excludeId && row.id === excludeId) continue;
    if (row.slug === slug) {
      throw new ConflictError(`A category with slug "${slug}" already exists.`);
    }
    if (row.code === code) {
      throw new ConflictError(`A category with code "${code}" already exists.`);
    }
  }
}

async function recomputeCategoryTree(): Promise<void> {
  const rows = await db
    .select()
    .from(categoriesTable)
    .where(isNull(categoriesTable.deletedAt));

  const byId = new Map<string, CategoryRow>();
  const childrenOf = new Map<string, CategoryRow[]>();
  for (const row of rows) byId.set(row.id, row);
  for (const row of rows) {
    if (row.parentId && byId.has(row.parentId)) {
      const siblings = childrenOf.get(row.parentId) ?? [];
      siblings.push(row);
      childrenOf.set(row.parentId, siblings);
    }
  }

  const visit = async (
    row: CategoryRow,
    parentPath: string,
    level: number,
  ): Promise<void> => {
    const path = `${parentPath}/${row.slug}`;
    const children = childrenOf.get(row.id) ?? [];
    const isLeaf = children.length === 0;
    if (row.path !== path || row.level !== level || row.isLeaf !== isLeaf) {
      await db
        .update(categoriesTable)
        .set({ path, level, isLeaf, updatedAt: new Date() })
        .where(eq(categoriesTable.id, row.id));
    }
    for (const child of children) await visit(child, path, level + 1);
  };

  for (const row of rows) {
    if (!row.parentId || !byId.has(row.parentId)) {
      await visit(row, "", 0);
    }
  }
}

export async function listAdminCategories(): Promise<CategoryRow[]> {
  return db
    .select()
    .from(categoriesTable)
    .where(isNull(categoriesTable.deletedAt))
    .orderBy(asc(categoriesTable.level), asc(categoriesTable.sortOrder), asc(categoriesTable.name));
}

export async function getAdminCategory(
  categoryId: string,
): Promise<CategoryRow> {
  const [category] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, categoryId))
    .limit(1);
  if (!category || category.deletedAt) {
    throw new NotFoundError("Category not found.");
  }
  return category;
}

export async function createAdminCategory(
  dto: CreateCategoryDto,
  createdBy: string | null,
): Promise<CategoryRow> {
  const slug = dto.slug ?? slugifyText(dto.name);
  const code =
    dto.code ??
    `CAT-${slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`.slice(0, 50);
  await assertSlugAndCodeFree(slug, code);

  let parent: CategoryRow | null = null;
  if (dto.parentId) {
    parent = await getAdminCategory(dto.parentId);
  }

  const [category] = await db
    .insert(categoriesTable)
    .values({
      name: dto.name,
      slug,
      code,
      description: dto.description ?? null,
      parentId: parent?.id ?? null,
      path: parent ? `${parent.path}/${slug}` : `/${slug}`,
      level: parent ? parent.level + 1 : 0,
      isLeaf: true,
      sortOrder: dto.sortOrder ?? 0,
      status: dto.status ?? "ACTIVE",
      isVisible: dto.isVisible ?? true,
      isFeatured: dto.isFeatured ?? false,
      createdBy,
      updatedBy: createdBy,
    })
    .returning();

  if (parent) await recomputeCategoryTree();
  return category;
}

export async function updateAdminCategory(
  categoryId: string,
  dto: UpdateCategoryDto,
  updatedBy: string | null,
): Promise<CategoryRow> {
  const existing = await getAdminCategory(categoryId);

  if (dto.slug && dto.slug !== existing.slug) {
    await assertSlugAndCodeFree(dto.slug, existing.code, categoryId);
  }

  let parentChanged = false;
  if (dto.parentId !== undefined && dto.parentId !== existing.parentId) {
    if (dto.parentId === categoryId) {
      throw new ConflictError("A category cannot be its own parent.");
    }
    if (dto.parentId) {
      // Cycle guard: the new parent must not be a descendant of this node.
      let cursor: CategoryRow | null = await getAdminCategory(dto.parentId);
      while (cursor) {
        if (cursor.id === categoryId) {
          throw new ConflictError(
            "A category cannot be moved under one of its own subcategories.",
          );
        }
        cursor = cursor.parentId
          ? await getAdminCategory(cursor.parentId).catch(() => null)
          : null;
      }
    }
    parentChanged = true;
  }

  const [category] = await db
    .update(categoriesTable)
    .set({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      parentId: dto.parentId,
      sortOrder: dto.sortOrder,
      status: dto.status,
      isVisible: dto.isVisible,
      isFeatured: dto.isFeatured,
      updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(categoriesTable.id, categoryId))
    .returning();

  if (parentChanged || (dto.slug && dto.slug !== existing.slug)) {
    await recomputeCategoryTree();
    return getAdminCategory(categoryId);
  }
  return category;
}

export async function deleteAdminCategory(
  categoryId: string,
): Promise<CategoryRow> {
  const existing = await getAdminCategory(categoryId);

  // Only live (non-deleted) children block deletion.
  const children = await db
    .select({ id: categoriesTable.id, deletedAt: categoriesTable.deletedAt })
    .from(categoriesTable)
    .where(eq(categoriesTable.parentId, categoryId));
  if (children.some((child) => !child.deletedAt)) {
    throw new ConflictError(
      "Category has subcategories. Move or delete them first.",
    );
  }

  const [productCount] = await db
    .select({ total: count() })
    .from(productsTable)
    .where(eq(productsTable.categoryId, categoryId));
  if ((productCount?.total ?? 0) > 0) {
    throw new ConflictError(
      "Category still has products assigned. Reassign them first.",
    );
  }

  const [deleted] = await db
    .update(categoriesTable)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(categoriesTable.id, existing.id))
    .returning();

  await recomputeCategoryTree();
  return deleted;
}
