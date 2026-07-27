import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { ProductImageService } from "@/modules/products/services/product-image.service";
import { DrizzleProductImageRepository } from "@/modules/products/repositories/repository/product-image.repository";

interface RouteContext {
  params: Promise<{
    productId: string;
    imageId: string;
  }>;
}

const productImageService = new ProductImageService(new DrizzleProductImageRepository());

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { imageId } = await params;
    await productImageService.deleteImage(imageId);
    return successResponse({ deleted: true });
  });
}
