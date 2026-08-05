import "reflect-metadata";
import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { ProductImageService } from "@/modules/products/services/product-image.service";
import { updateImageOrderSchema } from "@/modules/products/validations/product-image.schema";
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
    const { imageIds } = await parseBody(request, updateImageOrderSchema);
    const updatedImages = await productImageService.updateOrder(productId, imageIds);
    return successResponse(updatedImages);
  });
}
