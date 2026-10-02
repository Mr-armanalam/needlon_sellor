// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/errors/message-reaction-not-found-error.ts
// Description:
// Thrown when a requested message reaction cannot be found.
// ============================================================================

import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class MessageReactionNotFoundError extends NotFoundError {
    constructor() {
        super(
            "Message reaction not found.",
        );
    }
}