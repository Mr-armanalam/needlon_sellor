import { NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

export async function GET() {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: seller });
  } catch (error) {
    console.error("GET_CURRENT_SELLER_ME_ERROR", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
