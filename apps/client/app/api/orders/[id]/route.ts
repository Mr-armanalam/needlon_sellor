import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDER_DETAIL } from "@/lib/mock-data-provider";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    if (!orderId) return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    return Response.json(MOCK_ORDER_DETAIL, { status: 200 });
  } catch (error) {
    return Response.json(MOCK_ORDER_DETAIL, { status: 200 });
  }
}

