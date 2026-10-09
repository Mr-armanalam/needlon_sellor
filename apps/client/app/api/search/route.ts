import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

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

  // If nothing matched, return all mock products grouped
  if (Object.keys(grouped).length === 0) {
    MOCK_PRODUCTS.slice(0, 6).forEach(p => {
      const cat = MOCK_CATEGORIES.find(c => c.id === p.categoryId) || MOCK_CATEGORIES[0];
      if (!grouped[cat.category]) grouped[cat.category] = [];
      grouped[cat.category].push({ id: p.id, name: p.name, category: cat.category, subcategory: cat.CatType });
    });
  }

  return NextResponse.json({ searchResult: { ...grouped } });
}

