import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { currentAddressId = "addr-1" } = body;

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_URL || ""}/success?session_id=mock-session-123`,
      orderId: "ord-mock-001",
      total: 2499,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
