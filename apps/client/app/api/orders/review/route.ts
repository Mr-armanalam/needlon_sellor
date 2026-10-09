import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ReviewService } from "@/modules/orders/services/review-services";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderItemId, productId, comment, rating, title } = await req.json().catch(() => ({}));

    if (!productId || rating === undefined || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating, and comment are required" },
        { status: 400 }
      );
    }

    const review = await ReviewService.createReview({
      orderItemId,
      productId,
      userId: userId || "mock-user",
      rating: Number(rating),
      comment: String(comment),
      title,
    });

    return NextResponse.json(
      {
        review,
        orderItemId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const statusCode = error?.statusCode || 500;
    return NextResponse.json(
      { error: error?.message || "Failed to submit review" },
      { status: statusCode }
    );
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ allreview: [] }, { status: 200 });
    }

    const result = await ReviewService.getProductReviews(productId);

    return NextResponse.json(
      {
        allreview: result.reviews,
        averageRating: result.averageRating,
        reviewCount: result.reviewCount,
        distribution: result.distribution,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ allreview: [] }, { status: 200 });
  }
}
