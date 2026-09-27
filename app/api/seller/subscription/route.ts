import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getSubscriptionPlansService,
  getSellerSubscriptionService,
  updateSellerSubscriptionService,
} from "@/modules/subscription/services/subscription.service";
import { updateSubscriptionSchema } from "@/modules/subscription/dto/subscription.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const plans = await getSubscriptionPlansService();
    const subscription = await getSellerSubscriptionService();
    return successResponse({ plans, subscription });
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, updateSubscriptionSchema);
    const updated = await updateSellerSubscriptionService(body);
    return successResponse(updated);
  });
}
