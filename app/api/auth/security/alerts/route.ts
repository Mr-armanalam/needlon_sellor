import { NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getSecurityAlertsForSeller } from "@/modules/logout/lib/logout-service";

export async function GET() {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await getSecurityAlertsForSeller(seller.id);

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("GET_SECURITY_ALERTS_ERROR", error);

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
