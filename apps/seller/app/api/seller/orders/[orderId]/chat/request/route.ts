import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { requestOrderChatRepo } from "@/modules/orders/repositery/order-chat.repository";
import { z } from "zod";

const requestChatSchema = z.object({
  message: z.string().optional().nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () => {
    const seller = await getCurrentSellerOrThrow();
    const { orderId } = await params;
    const body = await request.json().catch(() => ({}));
    const { message } = requestChatSchema.parse(body);

    const permission = await requestOrderChatRepo(
      seller.id,
      orderId,
      message || undefined
    );

    return successResponse(permission);
  });
}
