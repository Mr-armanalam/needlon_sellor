import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {createCloneProductService} from "@/modules/products/services/create-clone-product.service";

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
    const cloneProduct = await createCloneProductService({productId, seller});
    return successResponse(cloneProduct, 201);

  });
}
