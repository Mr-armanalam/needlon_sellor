import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ReviewService } from "@/modules/orders/services/review-services";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

function getErrorStatusCode(error: unknown): number {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const statusCode = (error as { statusCode: unknown }).statusCode;
    return typeof statusCode === "number" ? statusCode : 500;
  }
  return 500;
}


export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderItemId, productId, comment, rating, title, allowEarlyReview } = await req.json().catch(() => ({}));

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
      allowEarlyReview: allowEarlyReview ?? true,
    });

    return NextResponse.json(
      {
        review,
        orderItemId: review.orderItemId || orderItemId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to submit review" },
      { status: statusCode }
    );
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
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
    }

    // Fallback if productId not specified: return published reviews with metadata mapping
    const { db } = await import("@needlon/db");
    const { reviewsTable } = await import("@needlon/db/db/schema/reviews/table");
    const { eq, desc } = await import("drizzle-orm");

    const rows = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.status, "PUBLISHED"))
      .orderBy(desc(reviewsTable.createdAt))
      .limit(50);

    return NextResponse.json(
      {
        allreview: rows.map((r) => ({
          ...r,
          orderItemId: r.metadata?.orderItemId || null,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ allreview: [] }, { status: 200 });
  }
}
