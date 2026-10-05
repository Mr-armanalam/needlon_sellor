import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerFeedbacksService } from "@/modules/feedback/services/feedback.service";
import { getSellerSupportTicketsService } from "@/modules/help/services/support.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const feedbacks = await getSellerFeedbacksService();
    const tickets = await getSellerSupportTicketsService();

    // Map into unified tracker items
    const unifiedList = [
      ...feedbacks.map((f) => ({
        id: f.id,
        ticketNumber: f.feedbackNumber,
        subject: f.title,
        category: f.category,
        priority: f.priority,
        status: f.status,
        type: "feedback",
        createdAt: f.createdAt,
      })),
      ...tickets.map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        type: "ticket",
        createdAt: t.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return successResponse({ items: unifiedList });
  });
}
