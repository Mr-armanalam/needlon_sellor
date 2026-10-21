import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { generateShipmentLabel } from "@/modules/delivery/services/carrier-booking.service";

interface RouteContext {
  params: Promise<{
    shipmentId: string;
  }>;
}

/**
 * Generate the carrier shipping label for a booked shipment and store the
 * label URL on the shipment (labelUrl / labelGeneratedAt, status becomes
 * LABEL_GENERATED when the shipment was still pre-dispatch).
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const { shipmentId } = await params;
    const result = await generateShipmentLabel(shipmentId);
    return successResponse(result);
  });
}
