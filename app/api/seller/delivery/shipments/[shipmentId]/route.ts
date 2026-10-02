import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { updateShipmentStatusService } from "@/modules/delivery/services/delivery.service";
import { updateShipmentStatusSchema } from "@/modules/delivery/dto/delivery.dto";

interface RouteContext {
  params: Promise<{
    shipmentId: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const rawParams = await params;
    const body = await parseBody(req, updateShipmentStatusSchema);

    const result = await updateShipmentStatusService({
      ...body,
      shipmentId: rawParams.shipmentId,
    });

    return successResponse(result);
  });
}
