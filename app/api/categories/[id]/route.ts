import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import {
  updateCategorySchema,
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "@/modules/categories";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return routeHandler(async () => {
    const { id } = await params;
    const category = await getCategoryService(id);
    return successResponse(category);
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return routeHandler(async () => {
    const { id } = await params;
    const body = await parseBody(request, updateCategorySchema);
    const updated = await updateCategoryService({
      id,
      ...body,
    });
    return successResponse(updated);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return routeHandler(async () => {
    const { id } = await params;
    const deleted = await deleteCategoryService(id);
    return successResponse(deleted);
  });
}
