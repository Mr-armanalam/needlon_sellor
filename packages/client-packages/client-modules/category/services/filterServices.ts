import { db } from "@/db";
import { filterOptions } from "@/db/schema/filter-options";
import { filterGroups } from "@/db/schema/filter-group";
import { productCategory } from "@/db/schema/product-category";
import { eq, asc, inArray, sql } from "drizzle-orm";
import { MOCK_CATEGORIES, MOCK_FILTER_GROUPS } from "@/lib/mock-data-provider";

/**  Finds category ID based on name using case-insensitive partial match */
export async function getCategoryIdByName(categoryName: string) {
  try {
    const [result] = await db
      .select({ id: productCategory.id })
      .from(productCategory)
      .where(sql`${categoryName.toLowerCase()} ILIKE '%' || ${productCategory.category} || '%'`);
    if (result?.id) return result.id;
  } catch { /* fall through */ }
  const mockCat = MOCK_CATEGORIES.find(c =>
    c.category.toLowerCase().includes(categoryName.toLowerCase()) ||
    c.CatType.toLowerCase().includes(categoryName.toLowerCase())
  );
  return mockCat?.id ?? MOCK_CATEGORIES[0].id;
}

/**  Fetches all groups and their options for a specific category */
export async function getCategoryFilters(categoryId: string) {
  try {
    const groups = await db
      .select()
      .from(filterGroups)
      .where(eq(filterGroups.categoryId, categoryId))
      .orderBy(asc(filterGroups.sortOrder));

    if (groups.length === 0) return MOCK_FILTER_GROUPS;

    const groupIds = groups.map((g) => g.id);
    const allOptions = await db
      .select()
      .from(filterOptions)
      .where(inArray(filterOptions.filterGroupId, groupIds))
      .orderBy(asc(filterOptions.sortOrder));

    const optionsMap = new Map<string, any[]>();
    allOptions.forEach((opt) => {
      const list = optionsMap.get(opt.filterGroupId) || [];
      list.push({ id: opt.id, label: opt.value, slug: opt.slug });
      optionsMap.set(opt.filterGroupId, list);
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      slug: group.slug,
      options: optionsMap.get(group.id) || [],
    }));
  } catch {
    console.warn("DB failed in getCategoryFilters, returning mock filters");
    return MOCK_FILTER_GROUPS;
  }
}

