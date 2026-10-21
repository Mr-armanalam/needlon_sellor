import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { listAdminSupportTicketsService } from "@/modules/admin/services/admin.service";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const search = req.nextUrl.searchParams.get("search") ?? undefined;
    const result = await listAdminSupportTicketsService({ status, search });
    return successResponse(result);
  });
}
