import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildUserPreferenceVector } from "@/lib/recommendation-item";
import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { productCategory } from "@/db/schema/product-category";
import { desc, eq, inArray } from "drizzle-orm";
import { ProductService } from "@/modules/product/services/kof-productServices";
import { getMockTransformedProducts, MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

const categoryMap: Record<string, string> = {
  "items-for-men": "men",
  "items-for-women": "women",
  "kids-wear": "kids",
};

const MOCK_TAG_DES = {
  descriptiveContent: "Explore our curated collection of premium fashion.",
  contentTag: "New Season",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let session: any = null;
    try { session = await auth(); } catch { /* auth may fail without DB */ }
    const userId = session?.user?.id;
    const filterType = searchParams.get("filterType") || "";

    const dynamicFilters: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (!["filterType", "sort"].includes(key)) dynamicFilters[key] = val;
    });

    let results: any[] = [];

    try {
      if (filterType === "recom-product" || filterType === "you-may-like") {
        results = await handlePersonalization(userId, filterType);
      } else if (filterType === "premium-product") {
        results = await ProductService.getPremium();
      } else if (filterType === "new-in") {
        results = await ProductService.getNewArrivals();
      } else {
        const dbValue = categoryMap[filterType] || filterType;
        results = await ProductService.getByCategory(dbValue, dynamicFilters);
      }
    } catch {
      results = [];
    }

    if (!results || results.length === 0) {
      return NextResponse.json(
        { productData: getMockTransformedProducts(), productTagDes: MOCK_TAG_DES },
        { status: 200 }
      );
    }

    const productData = results.map(transformProduct);
    const productTagDes = {
      descriptiveContent: results[0]?.category?.descriptiveContent || MOCK_TAG_DES.descriptiveContent,
      contentTag: results[0]?.category?.contentTag || results[0]?.product?.tagName || MOCK_TAG_DES.contentTag,
    };

    return NextResponse.json({ productData, productTagDes }, { status: 200 });

  } catch (error) {
    console.warn("GET_PRODUCTS_ERROR, returning mock:", error);
    return NextResponse.json(
      { productData: getMockTransformedProducts(), productTagDes: MOCK_TAG_DES },
      { status: 200 }
    );
  }
}

function transformProduct(r: any) {
  return {
    id: r.product.id,
    name: r.product.name,
    price: Number(r.product.price),
    mrp_price: Number(r.product.mrp_price),
    image: r.product.image,
    category: r.category?.category || "Uncategorized",
    rating: r.product.averageRating,
  };
}

async function handlePersonalization(userId: string | undefined, type: string) {
  try {
    if (!userId) return type === "recom-product" ? ProductService.getTrending() : ProductService.getNewArrivals();
    const prefs = await buildUserPreferenceVector(userId);
    if (prefs.topCategories.length === 0) return ProductService.getTrending();
    return db.select(ProductService.baseSelect)
      .from(productItems)
      .innerJoin(productCategory, eq(productItems.categoryId, productCategory.id))
      .where(inArray(productItems.categoryId, prefs.topCategories))
      .orderBy(desc(productItems.averageRating))
      .limit(12);
  } catch {
    return [];
  }
}