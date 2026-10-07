import { getCategoryFilters, getCategoryIdByName } from "@/modules/category/services/filterServices";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    // 1. Get Category ID
    const catId = await getCategoryIdByName(category);
    if (!catId) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // 2. Fetch and Format Filters
    const filters = await getCategoryFilters(catId);

    return NextResponse.json({ filters }, { status: 200 });

  } catch (error) {
    console.error("FILTER_API_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}