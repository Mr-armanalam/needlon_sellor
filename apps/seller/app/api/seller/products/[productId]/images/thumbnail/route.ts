import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { setPrimaryThumbnailService } from "@/modules/products/services";
import { setPrimaryThumbnailSchema } from "@/modules/products/validations/product-image.schema";

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
    const { imageId } = await parseBody(request, setPrimaryThumbnailSchema);
    const updated = await setPrimaryThumbnailService(productId, imageId);
    return successResponse(updated);
  });
}
