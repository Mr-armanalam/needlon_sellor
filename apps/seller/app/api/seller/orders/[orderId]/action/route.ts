import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { updateOrderStatusService } from "@/modules/orders/services";
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
    const rawParams = await params;
    
    // Validate path parameter (orderId)
    const { orderId } = getOrderByIdParamsSchema.parse(rawParams);

    // Validate request body using parseBody helper
    const { action, remarks } = await parseBody(req, updateOrderStatusBodySchema);
    
    // Call service to update status (internally resolves current seller)
    const result = await updateOrderStatusService({ orderId, action, remarks });

    return successResponse({
      orderId: result.orderId,
      fromStatus: result.fromStatus,
      toStatus: result.toStatus,
    });
  });
}
