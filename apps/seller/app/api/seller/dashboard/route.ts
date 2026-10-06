import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getDashboardOverviewService } from "@/modules/dashboard/services/dashboard.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const overview = await getDashboardOverviewService();
    return successResponse(overview);
  });
}
