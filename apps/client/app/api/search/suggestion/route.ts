import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

const MOCK_SUGGESTIONS = MOCK_PRODUCTS.slice(0, 6).map(p => {
  const cat = MOCK_CATEGORIES.find(c => c.id === p.categoryId) || MOCK_CATEGORIES[0];
  return { id: p.id, name: p.name, category: cat.category, subcategory: cat.CatType };
});

export async function GET() {
  return NextResponse.json({
    recent: [],
    suggested: MOCK_SUGGESTIONS,
  }, { status: 200 });
}

