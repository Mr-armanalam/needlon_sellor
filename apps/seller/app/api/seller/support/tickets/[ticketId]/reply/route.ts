import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { addTicketMessageService } from "@/modules/help/services/support.service";
import { z } from "zod";

const replySchema = z.object({
  message: z.string().min(1, "Message content is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return routeHandler(async () => {
    const { ticketId } = await params;
    const { message } = await parseBody(req, replySchema);
    const newMessage = await addTicketMessageService(ticketId, message);
    return successResponse(newMessage);
  });
}
