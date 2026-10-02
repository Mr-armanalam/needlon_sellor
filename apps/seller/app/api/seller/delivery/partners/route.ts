import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getShippingPartnersService } from "@/modules/delivery/services/delivery.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const partners = await getShippingPartnersService();
    return successResponse({ partners });
  });
}
