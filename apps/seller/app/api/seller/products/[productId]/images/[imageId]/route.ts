import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { deleteProductImageService } from "@/modules/products/services";

interface RouteContext {
  params: Promise<{
    productId: string;
    imageId: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { imageId } = await params;
    await deleteProductImageService(imageId);
    return successResponse({ deleted: true });
  });
}
