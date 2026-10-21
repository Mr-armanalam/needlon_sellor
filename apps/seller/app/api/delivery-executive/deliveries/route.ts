import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getExecutiveDeliveriesService,
  requireExecutiveSession,
} from "@/modules/delivery/services/executive.service";
import { EXECUTIVE_SESSION_COOKIE } from "@/modules/delivery/lib/executive-session";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const executive = await requireExecutiveSession(
      req.cookies.get(EXECUTIVE_SESSION_COOKIE)?.value,
    );
    const { deliveries } = await getExecutiveDeliveriesService(executive.id);
    return successResponse({ executive, deliveries });
  });
}
