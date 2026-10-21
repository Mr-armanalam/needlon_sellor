import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getAdminSupportThreadService,
  updateSupportTicketStatusService,
} from "@/modules/admin/services/admin.service";
import { updateSupportTicketStatusSchema } from "@/modules/admin/dto/admin.dto";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const { id } = await params;
    const result = await getAdminSupportThreadService(id);
    return successResponse(result);
  });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const { id } = await params;
    const body = await parseBody(req, updateSupportTicketStatusSchema);
    const result = await updateSupportTicketStatusService(id, body.status);
    return successResponse(result);
  });
}
