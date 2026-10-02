import { cookies } from "next/headers";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { revokeOtherSessionsForSellerService } from "@/modules/logout/services";
import { UnauthorizedError } from "@/modules/shared/errors";

export async function POST() {
  return routeHandler(async () => {
    const seller = await getCurrentSeller();

    if (!seller) {
      throw new UnauthorizedError();
    }

    const cookieStore = await cookies();
    const currentSessionId = cookieStore.get("session_id")?.value;

    const revokedCount = await revokeOtherSessionsForSellerService(
      seller.id,
      currentSessionId
    );

    return successResponse({
      success: true,
      revokedCount,
    });
  });
}
