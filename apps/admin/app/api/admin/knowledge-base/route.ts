import { NextRequest } from "next/server";
import { requireAdmin } from "@/modules/auth/lib/require-admin";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  createAdminKnowledgeBaseService,
  listAdminKnowledgeBaseService,
} from "@/modules/admin/services/admin.service";
import { createKnowledgeBaseArticleSchema } from "@/modules/admin/dto/admin.dto";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const result = await listAdminKnowledgeBaseService();
    return successResponse(result);
  });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  return routeHandler(async () => {
    const body = await parseBody(req, createKnowledgeBaseArticleSchema);
    const result = await createAdminKnowledgeBaseService(body);
    return successResponse(result, 201);
  });
}
