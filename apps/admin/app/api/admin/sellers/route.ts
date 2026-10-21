import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { listAdminSellersService } from "@/modules/admin/services/admin.service";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const result = await listAdminSellersService();
    return successResponse(result);
  });
}
