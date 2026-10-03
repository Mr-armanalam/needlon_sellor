import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getShippingPartnersService,
  connectCarrierService,
} from "@/modules/delivery/services/delivery.service";
import { connectCarrierSchema } from "@/modules/delivery/dto/delivery.dto";

export async function GET() {
  return routeHandler(async () => {
    const partners = await getShippingPartnersService();
    return successResponse({ partners });
  });
}

export async function PATCH(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validated = connectCarrierSchema.parse(body);
    const updated = await connectCarrierService(validated);
    return successResponse(updated, "Carrier partner updated successfully");
  });
}
