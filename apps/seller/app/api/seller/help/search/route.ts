import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { searchHelpCenterService } from "@/modules/help/services/help.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const results = await searchHelpCenterService(query);
    return successResponse(results);
  });
}
