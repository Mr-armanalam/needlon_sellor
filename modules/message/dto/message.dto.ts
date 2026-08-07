// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/message.dto.ts
// Description:
// DTO representing a message returned by the Messages API.
// ============================================================================

import {
    MessageStatus,
    MessageType,
} from "@/db/schema/messages";

import { MessageAttachmentDto } from "./message-attachment.dto";
import { MessageReactionDto } from "./message-reaction.dto";

/**
 * ============================================================================
 * Message Sender DTO
 * ============================================================================
 */

export interface MessageSenderDto {
    /**
     * Seller identifier.
     */
    id: string;

    /**
     * Display name.
     */
    name: string;

    /**
     * Profile image.
     */
    avatarUrl: string | null;
}

/**
 * ============================================================================
 * Reply Message DTO
 * ============================================================================
 */

export interface ReplyMessageDto {
    /**
     * Original message.
     */
    id: string;

    /**
     * Original sender.
     */
    senderName: string;

    /**
     * Preview text.
     */
    body: string | null;

    /**
     * Original message type.
     */
    messageType: MessageType;

    /**
     * Whether the original
     * message has been deleted.
     */
    isDeleted: boolean;
}

/**
 * ============================================================================
 * Message DTO
 * ============================================================================
 */

export interface MessageDto {
    /**
     * Message identifier.
     */
    id: string;

    /**
     * Conversation identifier.
     */
    conversationId: string;

    /**
     * Sender.
     */
    sender: MessageSenderDto;

    /**
     * Message type.
     */
    messageType: MessageType;

    /**
     * Delivery status.
     */
    status: MessageStatus;

    /**
     * Message body.
     */
    body: string | null;

    /**
     * Reply information.
     */
    replyTo: ReplyMessageDto | null;

    /**
     * Attachments.
     */
    attachments: MessageAttachmentDto[];

    /**
     * Reactions.
     */
    reactions: MessageReactionDto[];

    /**
     * Total attachment count.
     */
    attachmentCount: number;

    /**
     * Total reaction count.
     */
    reactionCount: number;

    /**
     * Read by all participants.
     */
    isReadByEveryone: boolean;

    /**
     * Edited flag.
     */
    isEdited: boolean;

    /**
     * Deleted flag.
     */
    isDeleted: boolean;

    /**
     * Whether the current seller
     * authored this message.
     */
    isOwnMessage: boolean;

    /**
     * Creation timestamp.
     */
    createdAt: string;

    /**
     * Last update timestamp.
     */
    updatedAt: string | null;

    /**
     * Edit timestamp.
     */
    editedAt: string | null;

    /**
     * Delete timestamp.
     */
    deletedAt: string | null;
}