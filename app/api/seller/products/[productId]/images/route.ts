import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { getProductImagesService, addProductImageService } from "@/modules/products/services";
import { createImageSchema } from "@/modules/products/validations/product-image.schema";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const images = await getProductImagesService(productId);
    return successResponse(images);
  });
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const body = await parseBody(request, createImageSchema);
    const image = await addProductImageService({
      ...body,
      productId,
    });
    return successResponse(image, 201);
  });
}
