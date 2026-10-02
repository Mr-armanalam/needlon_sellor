import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { requestPayoutService } from "@/modules/earnings/services/earnings.service";
import { requestPayoutSchema } from "@/modules/earnings/dto/finance.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, requestPayoutSchema);
    const result = await requestPayoutService(body);
    return successResponse(result);
  });
}
