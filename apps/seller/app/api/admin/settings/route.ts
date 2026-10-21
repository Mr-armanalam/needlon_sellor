import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getAdminSettingsService,
  updateAdminSettingsService,
} from "@/modules/admin/services/admin.service";
import { updatePlatformSettingsSchema } from "@/modules/admin/dto/admin.dto";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const result = await getAdminSettingsService();
    return successResponse(result);
  });
}

export async function PUT(req: NextRequest) {
  const { seller, error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const body = await parseBody(req, updatePlatformSettingsSchema);
    const result = await updateAdminSettingsService(body, seller.id);
    return successResponse(result);
  });
}
