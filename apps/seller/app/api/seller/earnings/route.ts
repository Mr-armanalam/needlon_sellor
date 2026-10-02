import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerEarningsService } from "@/modules/earnings/services/earnings.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const summary = await getSellerEarningsService();
    return successResponse(summary);
  });
}
