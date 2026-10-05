import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getTicketDetailsService,
  updateTicketStatusService,
} from "@/modules/help/services/support.service";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return routeHandler(async () => {
    const { ticketId } = await params;
    const ticket = await getTicketDetailsService(ticketId);
    return successResponse(ticket);
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return routeHandler(async () => {
    const { ticketId } = await params;
    const { status } = await parseBody(req, updateStatusSchema);
    const updated = await updateTicketStatusService(ticketId, status);
    return successResponse(updated);
  });
}
