import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getSecurityAlertsForSellerService } from "@/modules/logout/services";
import { UnauthorizedError } from "@/modules/shared/errors";

export async function GET() {
  return routeHandler(async () => {
    const seller = await getCurrentSeller();

    if (!seller) {
      throw new UnauthorizedError();
    }

    const alerts = await getSecurityAlertsForSellerService(seller.id);

    return successResponse(alerts);
  });
}
