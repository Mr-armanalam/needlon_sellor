import { z } from "zod";

export const createSupportTicketSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  category: z.enum(["ORDER_ISSUE", "PAYMENT_PAYOUT", "PRODUCT_CATALOG", "ACCOUNT_SETTINGS", "OTHER"]).default("OTHER"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type CreateSupportTicketDto = z.infer<typeof createSupportTicketSchema>;

export type SupportTicketCategory = CreateSupportTicketDto["category"];
export type SupportTicketPriority = CreateSupportTicketDto["priority"];
export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicketResponseDto {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: SupportTicketStatus;
  message: string;
  createdAt: string;
}

/** One entry in a ticket conversation timeline (row of `supportTicketMessages`, JSON-serialised). */
export interface SupportTicketTimelineItem {
  id: string;
  ticketId?: string;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: string;
  /** Legacy/alternate field names read by the timeline view. */
  text?: string;
  time?: string;
}

/** Ticket returned by the ticket-details endpoint: the ticket row plus its timeline. */
export interface SupportTicketDetailsDto extends SupportTicketResponseDto {
  sellerId?: string;
  assignedAgent?: string;
  updatedAt?: string;
  timeline?: SupportTicketTimelineItem[];
}
