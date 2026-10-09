import { ProductDetailService } from "@/modules/product/services/product-details-services";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) => {
  try {
    const { productId } = await params;
    if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Fetch Product
    const productRecord = await ProductDetailService.getProductBase(productId);
    
    // Check existence immediately before proceeding to sub-queries
    if (!productRecord) {
      return NextResponse.json({ productItem: null }, { status: 404 });
    }

    //  Fetch Filters
    const rawFilters = await ProductDetailService.getProductFilters(productId);

    // Transformation: Convert array of pairs to a single clean object
    // Result: { "Color": "Red", "Material": "Cotton" }
    const productFilterData = rawFilters.reduce((acc, curr) => {
      acc[curr.groupName] = curr.optionValue;
      return acc;
    }, {} as Record<string, string>);

    //  Final Response
    return NextResponse.json({
      productItem: {
        ...productRecord.product_items,
        category: productRecord.product_category,
        attributes: productFilterData
      }
    }, { status: 200 });

  } catch (error) {
    console.error("PRODUCT_DETAIL_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};