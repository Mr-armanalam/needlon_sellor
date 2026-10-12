import { getCategoryFilters, getCategoryIdByName } from "@/modules/category/services/filterServices";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const parentCategory = searchParams.get("parentCategory") || searchParams.get("parent") || undefined;

    if (!category && !parentCategory) {
      return NextResponse.json({ message: "Category or parentCategory is required" }, { status: 400 });
    }

    // 1. Resolve Category ID (with parentCategory context)
    const effectiveCategory = category || parentCategory!;
    const catId = await getCategoryIdByName(effectiveCategory, parentCategory);
    if (!catId) {
      return NextResponse.json({ message: "Category not found", filters: [] }, { status: 200 });
    }

    // 2. Fetch and Format Filters
    const filters = await getCategoryFilters(catId);

    return NextResponse.json({ filters }, { status: 200 });

  } catch (error) {
    console.error("FILTER_API_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}