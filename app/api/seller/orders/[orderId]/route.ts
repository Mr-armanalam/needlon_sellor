import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { getOrderByIdService } from "@/modules/orders/services/get-order-by-id.service";
import { successResponse } from "@/modules/shared/api/success-response";
import { getOrderByIdParamsSchema } from "@/modules/orders/validations";
import { OrderTransformer } from "@/modules/orders/transformers/order.transformer";

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () =>  {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const rawParams = await params;
    
    // Validate path parameters (orderId)
    const validatedParams = getOrderByIdParamsSchema.parse(rawParams);
    
    // Call service to get domain model
    const domainOrder = await getOrderByIdService(validatedParams, sellerId);
    
    // Transform domain model to detailed response DTO
    const responseDto = OrderTransformer.toDetailResponse(domainOrder);

    return successResponse(responseDto);
  });
}
