import { db } from "@needlon/db";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { categoryAttributesTable } from "@needlon/db/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@needlon/db/db/schema/catalog/category-attribute-options";
import { eq, and, ilike, asc } from "drizzle-orm";

import { inArray, or } from "drizzle-orm";

export interface FilterOptionDTO {
  id: string;
  label: string;
  slug: string;
  value?: string;
  count?: number;
}

export interface FilterGroupDTO {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  sortOrder?: number;
  options: FilterOptionDTO[];
}

export function normalizeCategoryName(name: string): string {
  if (!name) return "";
  const lower = name.toLowerCase().trim();
  if (lower === "items-for-men" || lower === "men" || lower === "mens") return "mens-wear";
  if (lower === "items-for-women" || lower === "women" || lower === "womens") return "women-wear";
  return lower;
}

/** Finds category ID based on name or slug, taking parent category context into account */
export async function getCategoryIdByName(
  categoryName: string,
  parentCategoryName?: string
): Promise<string> {
  if (!process.env.DATABASE_URL || !categoryName) return "";

  try {
    const normalizedName = normalizeCategoryName(categoryName);
    const normalizedParent = parentCategoryName ? normalizeCategoryName(parentCategoryName) : undefined;

    // 1. If parent category is specified, resolve parent first
    let parentCatId: string | null = null;
    if (normalizedParent) {
      const [parent] = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(
          or(
            ilike(categoriesTable.slug, `%${normalizedParent}%`),
            ilike(categoriesTable.name, `%${normalizedParent}%`)
          )
        )
        .limit(1);

      if (parent) {
        parentCatId = parent.id;
      }
    }

    // 2. If parent was found, search for subcategory under this parent
    if (parentCatId) {
      const singularSub = normalizedName.replace(/s$/, "");
      const [childCat] = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(
          and(
            eq(categoriesTable.parentId, parentCatId),
            or(
              ilike(categoriesTable.slug, `%${singularSub}%`),
              ilike(categoriesTable.name, `%${singularSub}%`),
              ilike(categoriesTable.slug, `%${normalizedName}%`),
              ilike(categoriesTable.name, `%${normalizedName}%`)
            )
          )
        )
        .limit(1);

      if (childCat) return childCat.id;
    }

    // 3. Fallback: direct name or slug match
    const singular = normalizedName.replace(/s$/, "");
    const [cat] = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(
        or(
          ilike(categoriesTable.slug, `%${normalizedName}%`),
          ilike(categoriesTable.name, `%${normalizedName}%`),
          ilike(categoriesTable.slug, `%${singular}%`),
          ilike(categoriesTable.name, `%${singular}%`)
        )
      )
      .limit(1);

    if (cat) return cat.id;

    // 4. Return parent ID if subcategory was not found but parent was
    if (parentCatId) return parentCatId;
  } catch (err) {
    console.warn("getCategoryIdByName DB error:", (err as Error).message);
  }

  return "";
}

/** Fetches all filter groups and their options for a specific category or its parent */
export async function getCategoryFilters(
  categoryId: string,
  parentCategoryId?: string
): Promise<FilterGroupDTO[]> {
  if (!process.env.DATABASE_URL || !categoryId) return [];

  try {
    // 1. Identify category record to check for parent_id
    const targetCategoryIds = new Set<string>();
    targetCategoryIds.add(categoryId);

    if (parentCategoryId) {
      targetCategoryIds.add(parentCategoryId);
    }

    const [categoryRecord] = await db
      .select({ id: categoriesTable.id, parentId: categoriesTable.parentId })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1);

    if (categoryRecord?.parentId) {
      targetCategoryIds.add(categoryRecord.parentId);
    }

    const idList = Array.from(targetCategoryIds);

    // 2. Fetch filterable attributes for the category and/or its parent
    const attributes = await db
      .select()
      .from(categoryAttributesTable)
      .where(
        and(
          inArray(categoryAttributesTable.categoryId, idList),
          eq(categoryAttributesTable.isFilterable, true)
        )
      )
      .orderBy(asc(categoryAttributesTable.displayOrder));

    if (attributes && attributes.length > 0) {
      const groups: FilterGroupDTO[] = [];

      for (const attr of attributes) {
        const options = await db
          .select()
          .from(categoryAttributeOptionsTable)
          .where(eq(categoryAttributeOptionsTable.attributeId, attr.id))
          .orderBy(asc(categoryAttributeOptionsTable.displayOrder));

        groups.push({
          id: attr.id,
          name: attr.name,
          slug: attr.slug,
          categoryId: attr.categoryId,
          sortOrder: attr.displayOrder,
          options: options.map((opt) => ({
            id: opt.id,
            label: opt.label,
            slug: opt.value,
            value: opt.value,
          })),
        });
      }

      return groups;
    }
  } catch (err) {
    console.warn("getCategoryFilters DB error:", (err as Error).message);
  }

  return [];
}