// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/message-attachment.dto.ts
// Description:
// DTO representing a message attachment returned by the Messages API.
// ============================================================================

import {
    MessageAttachmentType,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Message Attachment DTO
 * ============================================================================
 */

export interface MessageAttachmentDto {
    /**
     * Attachment identifier.
     */
    id: string;

    /**
     * Parent message.
     */
    messageId: string;

    /**
     * Attachment type.
     */
    attachmentType: MessageAttachmentType;

    /**
     * Original file name.
     */
    fileName: string;

    /**
     * MIME type.
     */
    mimeType: string;

    /**
     * Public URL.
     */
    url: string;

    /**
     * Thumbnail URL.
     */
    thumbnailUrl: string | null;

    /**
     * File size in bytes.
     */
    fileSize: number;

    /**
     * Image/Video width.
     */
    width: number | null;

    /**
     * Image/Video height.
     */
    height: number | null;

    /**
     * Media duration in seconds.
     */
    duration: number | null;

    /**
     * Whether the file
     * has finished uploading.
     */
    uploaded: boolean;

    /**
     * Upload timestamp.
     */
    uploadedAt: string | null;

    /**
     * Creation timestamp.
     */
    createdAt: string;
}