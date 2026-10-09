import { MOCK_CATEGORIES, MOCK_FILTER_GROUPS } from "@/lib/mock-data-provider";

/** Finds category ID based on name using case-insensitive partial match */
export async function getCategoryIdByName(categoryName: string) {
  const mockCat = MOCK_CATEGORIES.find(
    (c) =>
      c.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      c.CatType.toLowerCase().includes(categoryName.toLowerCase())
  );
  return mockCat?.id ?? MOCK_CATEGORIES[0].id;
}

/** Fetches all groups and their options for a specific category */
export async function getCategoryFilters(categoryId: string) {
  return MOCK_FILTER_GROUPS;
}