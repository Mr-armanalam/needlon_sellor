// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/errors/message-attachment-not-found-error.ts
// Description:
// Thrown when a requested message attachment cannot be found.
// ============================================================================

import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class MessageAttachmentNotFoundError extends NotFoundError {
    constructor() {
        super(
            "Message attachment not found.",
        );
    }
}