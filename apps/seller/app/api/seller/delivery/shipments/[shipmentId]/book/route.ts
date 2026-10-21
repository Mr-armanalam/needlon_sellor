import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { bookShipmentWithCarrier } from "@/modules/delivery/services/carrier-booking.service";

interface RouteContext {
  params: Promise<{
    shipmentId: string;
  }>;
}

/**
 * Book the shipment with its carrier's API (e.g. Shiprocket): creates the
 * provider order, persists the returned AWB/tracking/label, and records a
 * CARRIER_BOOKED tracking event. Fails loudly (no fabricated AWB) when the
 * seller has not connected the carrier or the partner has no API adapter.
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const { shipmentId } = await params;
    const result = await bookShipmentWithCarrier(shipmentId);
    return successResponse(result);
  });
}
