// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/errors/notification-not-found-error.ts
// Description:
// Thrown when a requested notification cannot be found.
// ============================================================================

import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class NotificationNotFoundError extends NotFoundError {
    constructor(notificationId?: string) {
        super(
            notificationId
                ? `Notification not found with ID: ${notificationId}`
                : "Notification not found.",
        );
    }
}