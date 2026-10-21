import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  createAdminPartnerService,
  listAdminPartnersService,
} from "@/modules/admin/services/admin.service";
import { createPartnerSchema } from "@/modules/admin/dto/admin.dto";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const result = await listAdminPartnersService();
    return successResponse(result);
  });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const body = await parseBody(req, createPartnerSchema);
    const result = await createAdminPartnerService(body);
    return successResponse(result, 201);
  });
}
