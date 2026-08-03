import { NextRequest } from "next/server";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {getOrderByIdService} from "@/modules/orders/services/get-order-by-id.service";
import {successResponse} from "@/modules/shared/api/success-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () =>  {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const { orderId } = await params;
    const result = await getOrderByIdService(orderId, sellerId);
    const { order, items, addresses, history, payments } = result;

    return successResponse(
      {
        ...order,
        items,
        addresses,
        history,
        payments,
      },
    );
  });
}
