// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/errors/conversation-not-found-error.ts
// Description:
// Thrown when a requested conversation cannot be found.
// ============================================================================

import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class ConversationNotFoundError extends NotFoundError {
    constructor(conversationId?: string) {
        super(
            conversationId
                ? `Conversation not found with ID: ${conversationId}`
                : "Conversation not found.",
        );
    }
}