import { NextRequest } from "next/server";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {getFilteredOrderService} from "@/modules/orders/services/get-filtered-order.service";
import {successResponse} from "@/modules/shared/api/success-response";

export async function GET(req: NextRequest) {
  return routeHandler(async () =>  {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const { searchParams } = new URL(req.url);
    const { items, counts } = await getFilteredOrderService(searchParams, sellerId);
    return successResponse({ items, counts});
  });
}
