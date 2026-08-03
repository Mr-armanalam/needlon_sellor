import { NextRequest, NextResponse } from "next/server";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {updateOrderStatusService} from "@/modules/orders/services/update-order-status.service";
import {successResponse} from "@/modules/shared/api/success-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () =>  {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const { orderId } = await params;

    const body = await req.json();
    const { action, remarks } = body;
    const result = await updateOrderStatusService({orderId, sellerId, action, remarks});

    return successResponse({
      orderId,
      fromStatus: result.fromStatus,
      toStatus: result.toStatus,
    });
  })
}
