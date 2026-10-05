import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { createCallbackRequestService } from "@/modules/help/services/help.service";
import { z } from "zod";

const callbackSchema = z.object({
  phoneNumber: z.string().min(8, "Valid phone number is required"),
  preferredTimeSlot: z.string().min(1, "Preferred time slot is required"),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const { phoneNumber, preferredTimeSlot, reason } = await parseBody(req, callbackSchema);
    const callbackRequest = await createCallbackRequestService(phoneNumber, preferredTimeSlot, reason);
    return successResponse(callbackRequest);
  });
}
