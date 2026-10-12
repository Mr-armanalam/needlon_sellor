import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { publishDraftProductService } from "@/modules/products/services";
import { publishProductSchema } from "@/modules/products/validations/publish.schema";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const seller = await getCurrentSellerOrThrow();
    const body = await parseBody(request, publishProductSchema);
    const published = await publishDraftProductService(productId, body, seller.id);
    return successResponse(published);
  });
}
