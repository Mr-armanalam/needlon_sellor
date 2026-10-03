import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getSellerCampaignsService,
  createCampaignService,
} from "@/modules/marketing/services/marketing.service";
import { createCampaignSchema } from "@/modules/marketing/dto/marketing.dto";

export async function GET() {
  return routeHandler(async () => {
    const campaigns = await getSellerCampaignsService();
    return successResponse(campaigns);
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validated = createCampaignSchema.parse(body);
    const newCampaign = await createCampaignService(validated);
    return successResponse(newCampaign, "Campaign created successfully");
  });
}
