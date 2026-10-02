import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { reorderProductImagesService } from "@/modules/products/services";
import { updateImageOrderSchema } from "@/modules/products/validations/product-image.schema";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const { imageIds } = await parseBody(request, updateImageOrderSchema);
    const updatedImages = await reorderProductImagesService(productId, imageIds);
    return successResponse(updatedImages);
  });
}
