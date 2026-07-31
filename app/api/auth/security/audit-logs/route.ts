import { NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getAuditTrailForSeller } from "@/modules/logout/lib/logout-service";

export async function GET() {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auditLogs = await getAuditTrailForSeller(seller.id);

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("GET_AUDIT_LOGS_ERROR", error);

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
