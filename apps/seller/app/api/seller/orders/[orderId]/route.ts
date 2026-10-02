import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { getOrderByIdService } from "@/modules/orders/services";
import { successResponse } from "@/modules/shared/api/success-response";
import { getOrderByIdParamsSchema } from "@/modules/orders/validations";
import { toOrderDetailResponse } from "@/modules/orders/mapper";

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
    const rawParams = await params;
    
    // Validate path parameters (orderId)
    const validatedParams = getOrderByIdParamsSchema.parse(rawParams);
    
    // Call service to get domain model (internally resolves current seller)
    const domainOrder = await getOrderByIdService(validatedParams);
    
    // Transform domain model to detailed response DTO
    const responseDto = toOrderDetailResponse(domainOrder);

    return successResponse(responseDto);
  });
}
