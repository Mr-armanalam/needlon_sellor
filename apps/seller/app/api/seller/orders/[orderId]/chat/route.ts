import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getOrderChatDetails,
  sendOrderChatMessageRepo,
} from "@/modules/orders/repositery/order-chat.repository";
import { z } from "zod";

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () => {
    const seller = await getCurrentSellerOrThrow();
    const { orderId } = await params;
    const chatDetails = await getOrderChatDetails(orderId, "SELLER", seller.id);
    return successResponse(chatDetails);
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () => {
    const seller = await getCurrentSellerOrThrow();
    const { orderId } = await params;
    const body = await request.json();
    const { content } = sendMessageSchema.parse(body);

    const message = await sendOrderChatMessageRepo(
      orderId,
      seller.id,
      "SELLER",
      content
    );

    return successResponse(message);
  });
}
