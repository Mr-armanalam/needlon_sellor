import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  createAdminHeroBannerService,
  listAdminHeroBannersService,
} from "@/modules/admin/services/admin.service";
import { createHeroBannerSchema } from "@/modules/admin/dto/admin.dto";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const result = await listAdminHeroBannersService();
    return successResponse(result);
  });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const body = await parseBody(req, createHeroBannerSchema);
    const result = await createAdminHeroBannerService(body);
    return successResponse(result, 201);
  });
}
