import { ProductDetailService } from "@/modules/product/services/product-details-services";
import { ReviewService } from "@/modules/orders/services/review-services";
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

    // Fetch Filters
    const rawFilters = await ProductDetailService.getProductFilters(productId);

    // Transformation: Convert array of pairs to a single clean object
    const productFilterData = rawFilters.reduce((acc, curr) => {
      if (curr.groupName) {
        acc[curr.groupName] = curr.optionValue ?? "";
      }
      return acc;
    }, {} as Record<string, string>);

    // Compute live reviews and rating distribution from reviewsTable
    const reviewData = await ReviewService.getProductReviews(productId);

    const baseItem = productRecord.product_items;
    const finalAverageRating =
      reviewData.reviewCount > 0 ? reviewData.averageRating : baseItem.averageRating || "4.5";
    const finalReviewCount =
      reviewData.reviewCount > 0 ? reviewData.reviewCount : baseItem.reviewCount || 0;

    // Final Response
    return NextResponse.json({
      productItem: {
        ...baseItem,
        averageRating: finalAverageRating,
        reviewCount: finalReviewCount,
        ratingDistribution: reviewData.distribution,
        category: productRecord.product_category,
        attributes: productFilterData
      }
    }, { status: 200 });

  } catch (error) {
    console.error("PRODUCT_DETAIL_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};