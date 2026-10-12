import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { updateDraftProductSeoService } from "@/modules/products/services";
import { updateSeoSchema } from "@/modules/products/validations/seo.schema";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";

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
    const seller = await getCurrentSellerOrThrow();
    const body = await parseBody(request, updateSeoSchema);
    const updated = await updateDraftProductSeoService(productId, body, seller.id);
    return successResponse(updated);
  });
}
