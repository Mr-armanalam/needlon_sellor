import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { ProductImageService } from "@/modules/products/services/product-image.service";
import { setPrimaryThumbnailSchema } from "@/modules/products/validations/product-image.schema";
import { DrizzleProductImageRepository } from "@/modules/products/repositories/repository/product-image.repository";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

const productImageService = new ProductImageService(new DrizzleProductImageRepository());

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const { imageId } = await parseBody(request, setPrimaryThumbnailSchema);
    const updated = await productImageService.setThumbnail(productId, imageId);
    return successResponse(updated);
  });
}
