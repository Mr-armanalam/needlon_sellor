import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import {
  createCategorySchema,
  createCategoryService,
  getCategoriesService,
} from "@/modules/categories";

export async function GET() {
  return routeHandler(async () => {
    const result = await getCategoriesService();
    return successResponse(result);
  });
}

export async function POST(request: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(request, createCategorySchema);
    const created = await createCategoryService(body);
    return successResponse(created, 201);
  });
}
