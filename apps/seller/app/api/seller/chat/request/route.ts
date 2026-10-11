import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { requestChatPermissionService } from "@/modules/customers/services/customer.service";
import { z } from "zod";

const requestChatSchema = z.object({
  buyerId: z.string().uuid("Valid buyerId is required"),
  message: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const { buyerId, message } = requestChatSchema.parse(body);

    const result = await requestChatPermissionService(buyerId, message || undefined);
    return successResponse(result);
  });
}
