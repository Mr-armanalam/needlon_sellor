import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { syncShipmentTracking } from "@/modules/delivery/services/carrier-booking.service";

interface RouteContext {
  params: Promise<{
    shipmentId: string;
  }>;
}

/**
 * Pull the carrier's latest tracking for this shipment: appends new scan
 * events to shipment_tracking_events (deduped) and advances the shipment
 * (and order) status when the carrier reports progress.
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const { shipmentId } = await params;
    const result = await syncShipmentTracking(shipmentId);
    return successResponse(result);
  });
}
