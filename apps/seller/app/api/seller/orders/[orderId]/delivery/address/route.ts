import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { addOrderDeliveryAddressSchema } from "@/modules/delivery/dto/delivery.dto";
import { addOrderDeliveryAddressService } from "@/modules/delivery/services/delivery.service";

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const rawParams = await params;
    const { orderId } = rawParams;
    const body = await parseBody(req, addOrderDeliveryAddressSchema);

    const result = await addOrderDeliveryAddressService(orderId, body);

    return successResponse(result);
  });
}
