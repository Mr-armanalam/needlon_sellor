import { NextResponse } from "next/server";
import { db } from "@/db";
import { ilike, desc, eq, or } from "drizzle-orm";
import { productItems } from "@/db/schema/product-items";
import { productCategory } from "@/db/schema/product-category";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ searchResult: [] }, { status: 400 });
  }

  try {
    const products = await db
      .select({
        id: productItems.id,
        name: productItems.name,
        category: productCategory.category,
        subcategory: productCategory.CatType,
      })
      .from(productItems)
      .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
      .where(
        or(
          ilike(productItems.name, `%${query}%`),
          ilike(productCategory.category, `%${query}%`),
          ilike(productCategory.CatType, `%${query}%`)
        )
      )
      .limit(12);

    if (products.length > 0) {
      const grouped: Record<string, any[]> = {};
      for (const p of products) {
        const key = p.category;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
      }
      return NextResponse.json({ searchResult: { ...grouped } });
    }
  } catch {
    /* fall through to mock */
  }

  // Mock search fallback
  const lowerQ = query.toLowerCase();
  const matched = MOCK_PRODUCTS
    .filter(p => p.name.toLowerCase().includes(lowerQ) || p.tagName.toLowerCase().includes(lowerQ))
    .map(p => {
      const cat = MOCK_CATEGORIES.find(c => c.id === p.categoryId) || MOCK_CATEGORIES[0];
      return { id: p.id, name: p.name, category: cat.category, subcategory: cat.CatType };
    });

  const grouped: Record<string, any[]> = {};
  for (const p of matched) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  // If nothing matched mock either, return all products grouped
  if (Object.keys(grouped).length === 0) {
    MOCK_PRODUCTS.slice(0, 6).forEach(p => {
      const cat = MOCK_CATEGORIES.find(c => c.id === p.categoryId) || MOCK_CATEGORIES[0];
      if (!grouped[cat.category]) grouped[cat.category] = [];
      grouped[cat.category].push({ id: p.id, name: p.name, category: cat.category, subcategory: cat.CatType });
    });
  }

  return NextResponse.json({ searchResult: { ...grouped } });
}
