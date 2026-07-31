import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { revokeOtherSessionsForSeller } from "@/modules/logout/lib/logout-service";

export async function POST() {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const currentSessionId = cookieStore.get("session_id")?.value;

    const revokedCount = await revokeOtherSessionsForSeller(
      seller.id,
      currentSessionId
    );

    return NextResponse.json({
      success: true,
      revokedCount,
    });
  } catch (error) {
    console.error("LOGOUT_OTHERS_ERROR", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
