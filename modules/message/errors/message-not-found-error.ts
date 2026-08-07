// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/errors/message-not-found-error.ts
// Description:
// Thrown when a requested message cannot be found.
// ============================================================================

import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class MessageNotFoundError extends NotFoundError {
    constructor(messageId?: string) {
        super(
            messageId
                ? `Message not found with ID: ${messageId}`
                : "Message not found.",
        );
    }
}