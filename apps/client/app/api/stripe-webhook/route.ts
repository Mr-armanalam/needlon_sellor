import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

