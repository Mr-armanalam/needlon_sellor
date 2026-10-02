// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/update-message.dto.ts
// Description:
// Request DTO for updating an existing message.
// ============================================================================

/**
 * ============================================================================
 * Update Message DTO
 * ============================================================================
 */

export interface UpdateMessageDto {
    /**
     * Message identifier.
     */
    messageId: string;

    /**
     * Updated message body.
     */
    body: string;

    /**
     * Whether existing
     * attachments should
     * be preserved.
     */
    keepAttachments?: boolean;

    /**
     * Updated timestamp.
     *
     * Used for optimistic
     * concurrency checks.
     */
    updatedAt?: string;
}