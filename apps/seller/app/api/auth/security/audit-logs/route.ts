import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getAuditTrailForSellerService } from "@/modules/logout/services";
import { UnauthorizedError } from "@/modules/shared/errors";

export async function GET() {
  return routeHandler(async () => {
    const seller = await getCurrentSeller();

    if (!seller) {
      throw new UnauthorizedError();
    }

    const auditLogs = await getAuditTrailForSellerService(seller.id);

    return successResponse(auditLogs);
  });
}
