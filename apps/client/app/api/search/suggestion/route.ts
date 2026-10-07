import { NextResponse } from "next/server";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { userViewHistory } from "@/db/schema/user-view-history";
import { productItems } from "@/db/schema/product-items";
import { productCategory } from "@/db/schema/product-category";
import { auth } from "@/auth";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

const MOCK_SUGGESTIONS = MOCK_PRODUCTS.slice(0, 6).map(p => {
  const cat = MOCK_CATEGORIES.find(c => c.id === p.categoryId) || MOCK_CATEGORIES[0];
  return { id: p.id, name: p.name, category: cat.category, subcategory: cat.CatType };
});

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let recent: any[] = [];
    let suggested: any[] = [];

    if (userId) {
      try {
        recent = await db
          .select({
            id: productItems.id,
            name: productItems.name,
            category: productCategory.category,
            subcategory: productCategory.CatType,
          })
          .from(userViewHistory)
          .innerJoin(productItems, eq(userViewHistory.productId, productItems.id))
          .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
          .where(eq(userViewHistory.userId, userId))
          .orderBy(desc(userViewHistory.createdAt))
          .limit(6);
      } catch { recent = []; }
    }

    try {
      suggested = await db
        .select({
          id: productItems.id,
          name: productItems.name,
          category: productCategory.category,
          subcategory: productCategory.CatType,
        })
        .from(productItems)
        .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
        .orderBy(desc(productItems.createdAt))
        .limit(10);
    } catch { suggested = []; }

    return NextResponse.json({
      recent: recent.length ? recent : [],
      suggested: suggested.length ? suggested : MOCK_SUGGESTIONS,
    }, { status: 200 });

  } catch (error) {
    console.warn("Search suggestion error, returning mock:", error);
    return NextResponse.json({ recent: [], suggested: MOCK_SUGGESTIONS }, { status: 200 });
  }
}
