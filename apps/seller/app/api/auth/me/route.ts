import { NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

export async function GET() {
  const seller = await getCurrentSeller();
  
  if (!seller) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: seller });
}
