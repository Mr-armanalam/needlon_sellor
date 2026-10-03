import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getSellerReferralService,
  createOrUpdateReferralService,
} from "@/modules/marketing/services/marketing.service";
import { createReferralSchema } from "@/modules/marketing/dto/marketing.dto";

export async function GET() {
  return routeHandler(async () => {
    const referralInfo = await getSellerReferralService();
    return successResponse(referralInfo);
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validated = createReferralSchema.parse(body);
    const updated = await createOrUpdateReferralService(validated);
    return successResponse(updated, "Referral program updated successfully");
  });
}
