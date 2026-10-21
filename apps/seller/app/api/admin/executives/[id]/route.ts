import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  deleteExecutiveService,
  updateExecutiveService,
} from "@/modules/delivery/services/executive.service";
import { updateExecutiveSchema } from "@/modules/delivery/dto/executive.dto";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const { id } = await params;
    const body = await parseBody(req, updateExecutiveSchema);
    const result = await updateExecutiveService(id, body);
    return successResponse(result);
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const { id } = await params;
    const result = await deleteExecutiveService(id);
    return successResponse(result);
  });
}
