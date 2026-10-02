import { cookies } from "next/headers";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getActiveSessionsForSellerService } from "@/modules/logout/services";
import { UnauthorizedError } from "@/modules/shared/errors";

export async function GET() {
  return routeHandler(async () => {
    const currentSeller = await getCurrentSeller();

    if (!currentSeller) {
      throw new UnauthorizedError();
    }

    const cookieStore = await cookies();
    const currentSessionId = cookieStore.get("session_id")?.value;

    const formattedSessions = await getActiveSessionsForSellerService(
      currentSeller.id,
      currentSessionId
    );

    return successResponse(formattedSessions);
  });
}
