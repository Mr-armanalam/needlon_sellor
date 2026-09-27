import { z } from "zod";

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid("Invalid notification ID").optional(),
  markAll: z.boolean().optional().default(false),
});

export const updateNotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  orderEnabled: z.boolean().optional(),
  messageEnabled: z.boolean().optional(),
  reviewEnabled: z.boolean().optional(),
  promotionEnabled: z.boolean().optional(),
});

export type MarkNotificationReadDto = z.infer<typeof markNotificationReadSchema>;
export type UpdateNotificationPreferencesDto = z.infer<typeof updateNotificationPreferencesSchema>;

export interface NotificationItemDto {
  id: string;
  recipientId: string;
  notificationType: string;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferencesResponseDto {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  orderEnabled: boolean;
  messageEnabled: boolean;
  reviewEnabled: boolean;
  promotionEnabled: boolean;
}
