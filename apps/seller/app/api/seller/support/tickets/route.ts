import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getSellerSupportTicketsService,
  createSupportTicketService,
} from "@/modules/help/services/support.service";
import { createSupportTicketSchema } from "@/modules/help/dto/support.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const tickets = await getSellerSupportTicketsService();
    return successResponse({ tickets });
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, createSupportTicketSchema);
    const ticket = await createSupportTicketService(body);
    return successResponse(ticket);
  });
}
