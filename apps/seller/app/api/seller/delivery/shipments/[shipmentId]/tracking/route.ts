import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getShipmentTrackingService } from "@/modules/delivery/services/delivery.service";

interface RouteContext {
  params: Promise<{
    shipmentId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const { shipmentId } = await params;
    const tracking = await getShipmentTrackingService(shipmentId);
    return successResponse(tracking);
  });
}
