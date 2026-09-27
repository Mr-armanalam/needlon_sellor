import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerShipmentsService, createShipmentOrderService } from "@/modules/delivery/services/delivery.service";
import { createShipmentOrderSchema, getShipmentsQuerySchema } from "@/modules/delivery/dto/delivery.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedQuery = getShipmentsQuerySchema.parse(queryObj);

    const shipments = await getSellerShipmentsService(validatedQuery.status);

    const counts = {
      total: shipments.length,
      inTransit: shipments.filter((s) => s.status === "IN_TRANSIT" || s.status === "OUT_FOR_DELIVERY").length,
      delivered: shipments.filter((s) => s.status === "DELIVERED").length,
      pending: shipments.filter((s) => s.status === "PENDING" || s.status === "READY_FOR_PICKUP").length,
    };

    return successResponse({ shipments, counts });
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, createShipmentOrderSchema);
    const shipment = await createShipmentOrderService(body);
    return successResponse(shipment);
  });
}
