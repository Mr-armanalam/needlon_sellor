import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getChatPermissionService } from "@/modules/customers/services/customer.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");

    if (!buyerId) {
      throw new Error("Missing buyerId parameter");
    }

    const permission = await getChatPermissionService(buyerId);
    return successResponse(permission);
  });
}
