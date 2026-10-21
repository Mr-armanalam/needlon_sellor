import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  createAdminCategoryService,
  listAdminCategoriesService,
} from "@/modules/admin/services/admin.service";
import { createCategorySchema } from "@/modules/admin/dto/admin.dto";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const result = await listAdminCategoriesService();
    return successResponse(result);
  });
}

export async function POST(req: NextRequest) {
  const { seller, error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const body = await parseBody(req, createCategorySchema);
    const result = await createAdminCategoryService(body, seller.id);
    return successResponse(result, 201);
  });
}
