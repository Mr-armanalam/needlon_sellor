import { NextRequest } from "next/server";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {getFilteredProductsService} from "@/modules/products/services/get-filtered-products.service";
import {successResponse} from "@/modules/shared/api/success-response";
import {routeHandler} from "@/modules/shared/api/route-handler";

export async function GET(req: NextRequest) {
  return routeHandler(async () =>   {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const { searchParams } = new URL(req.url);
    const productMap = await getFilteredProductsService(searchParams, sellerId);
    const items = Array.from(productMap.values());

    return successResponse({
      items,
      nextCursor: null,
    });
  });
}
