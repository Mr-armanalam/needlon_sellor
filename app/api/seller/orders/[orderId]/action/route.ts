import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { updateOrderStatusService } from "@/modules/orders/services/update-order-status.service";
import { successResponse } from "@/modules/shared/api/success-response";
import { getOrderByIdParamsSchema, updateOrderStatusBodySchema } from "@/modules/orders/validations";

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () =>  {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const rawParams = await params;
    
    // Validate path parameter (orderId)
    const { orderId } = getOrderByIdParamsSchema.parse(rawParams);

    // Validate request body
    const body = await req.json();
    const { action, remarks } = updateOrderStatusBodySchema.parse(body);
    
    // Call service to update status
    const result = await updateOrderStatusService({ orderId, action, remarks }, sellerId);

    return successResponse({
      orderId: result.orderId,
      fromStatus: result.fromStatus,
      toStatus: result.toStatus,
    });
  });
}
