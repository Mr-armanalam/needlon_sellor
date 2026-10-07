import { ilike, or, sql } from "drizzle-orm";
import { productCategory } from "@/db/schema/product-category";

export function buildSubcategoryFilter(slug: string) {
  if (!slug) return undefined;

  const words = slug.split("-").filter(word => word.length > 3);
  
  const wordFilters = words.map(word => or(
    ilike(productCategory.SubCatType, `%${word}%`),
    ilike(productCategory.category, `%${word}%`)
  ));

  return or(
    sql`lower(${slug}) LIKE '%' || lower(${productCategory.SubCatType}) || '%'`,
    sql`lower(${slug}) LIKE '%' || lower(${productCategory.category}) || '%'`,
    ...wordFilters
  );
}