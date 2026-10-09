import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { orderItemId, productId, comment, rating } = await req.json();
    return NextResponse.json({
      review: {
        id: "rev-" + Date.now(),
        orderItemId,
        productId,
        rating,
        comment,
      },
      orderItemId
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
};

export async function GET() {
  return NextResponse.json({ allreview: [] }, { status: 200 });
}

