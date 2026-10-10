import { db } from "@needlon/db";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { categoryAttributesTable } from "@needlon/db/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@needlon/db/db/schema/catalog/category-attribute-options";
import { eq, and, ilike, asc } from "drizzle-orm";

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
      console.warn("getCategoryIdByName DB error:", (err as Error).message);
    }
  }

  return "";
}

/** Fetches all filter groups and their options for a specific category */
export async function getCategoryFilters(categoryId: string): Promise<FilterGroupDTO[]> {
  if (process.env.DATABASE_URL && categoryId) {
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
  }

  return [];
}