import { db } from "@needlon/db";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { categoryAttributesTable } from "@needlon/db/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@needlon/db/db/schema/catalog/category-attribute-options";
import { eq, and, ilike, asc } from "drizzle-orm";
import {
  DEFAULT_MOCK_CATEGORIES as MOCK_CATEGORIES,
  DEFAULT_MOCK_FILTER_GROUPS as MOCK_FILTER_GROUPS,
} from "../../../data/mock-catalog-fallback";

export interface FilterOptionDTO {
  id: string;
  label: string;
  slug: string;
  value?: string;
}

export interface FilterGroupDTO {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  sortOrder?: number;
  options: FilterOptionDTO[];
}

/** Finds category ID based on name or slug */
export async function getCategoryIdByName(categoryName: string): Promise<string> {
  if (process.env.DATABASE_URL) {
    try {
      const [cat] = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(
          ilike(categoriesTable.name, `%${categoryName}%`)
        )
        .limit(1);

      if (cat) return cat.id;

      const [catBySlug] = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(
          ilike(categoriesTable.slug, `%${categoryName}%`)
        )
        .limit(1);

      if (catBySlug) return catBySlug.id;
    } catch (err) {
      console.warn("getCategoryIdByName DB fallback:", (err as Error).message);
    }
  }

  // Fallback to mock categories
  const mockCat = MOCK_CATEGORIES.find(
    (c) =>
      c.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      c.CatType.toLowerCase().includes(categoryName.toLowerCase())
  );
  return mockCat?.id ?? MOCK_CATEGORIES[0].id;
}

/** Fetches all filter groups and their options for a specific category */
export async function getCategoryFilters(categoryId: string): Promise<FilterGroupDTO[]> {
  if (process.env.DATABASE_URL) {
    try {
      const attributes = await db
        .select()
        .from(categoryAttributesTable)
        .where(
          and(
            eq(categoryAttributesTable.categoryId, categoryId),
            eq(categoryAttributesTable.isFilterable, true)
          )
        )
        .orderBy(asc(categoryAttributesTable.displayOrder));

      if (attributes.length > 0) {
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

        if (groups.length > 0) {
          return groups;
        }
      }
    } catch (err) {
      console.warn("getCategoryFilters DB fallback:", (err as Error).message);
    }
  }

  // Fallback to mock filter groups
  return MOCK_FILTER_GROUPS;
}