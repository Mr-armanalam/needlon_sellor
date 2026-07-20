import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getProductService,
  updateProductService,
  deleteProductService,
} from "@/modules/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return routeHandler(async () => {
    const { id } = await params;
    const product = await getProductService(id);
    return successResponse(product);
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return routeHandler(async () => {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateProductService({
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
    const deleted = await deleteProductService(id);
    return successResponse(deleted);
  });
}
