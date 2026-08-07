// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/errors/conversation-member-not-found-error.ts
// Description:
// Thrown when a requested conversation member cannot be found.
// ============================================================================

import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class ConversationMemberNotFoundError extends NotFoundError {
    constructor() {
        super(
            "Conversation member not found.",
        );
    }
}