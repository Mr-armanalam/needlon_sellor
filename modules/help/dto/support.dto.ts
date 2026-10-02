import { z } from "zod";

export const createSupportTicketSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  category: z.enum(["ORDER_ISSUE", "PAYMENT_PAYOUT", "PRODUCT_CATALOG", "ACCOUNT_SETTINGS", "OTHER"]).default("OTHER"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type CreateSupportTicketDto = z.infer<typeof createSupportTicketSchema>;

export interface SupportTicketResponseDto {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  message: string;
  createdAt: string;
}
