// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/api/message.api.ts
// Description:
// Frontend API functions for message operations.
// ============================================================================

import {
    apiClient,
} from "@/modules/shared/api";

import {
    MessageDto,
    SendMessageDto,
    UpdateMessageDto,
} from "../dto";

/**
 * ============================================================================
 * Conversation Messages
 * ============================================================================
 */

export async function getConversationMessages(
    conversationId: string,
) {
    return apiClient.get<
        MessageDto[]
    >(
        `/api/messages/conversations/${conversationId}/messages`,
    );
}

/**
 * ============================================================================
 * Send Message
 * ============================================================================
 */

export async function sendMessage(
    body: SendMessageDto,
) {
    return apiClient.post<
        MessageDto,
        SendMessageDto
    >(
        `/api/messages/conversations/${body.conversationId}/messages`,
        body,
    );
}

/**
 * ============================================================================
 * Single Message
 * ============================================================================
 */

export async function getMessage(
    messageId: string,
) {
    return apiClient.get<
        MessageDto
    >(
        `/api/messages/messages/${messageId}`,
    );
}

/**
 * ============================================================================
 * Update Message
 * ============================================================================
 */

export async function updateMessage(
    body: UpdateMessageDto,
) {
    return apiClient.patch<
        MessageDto,
        UpdateMessageDto
    >(
        `/api/messages/messages/${body.messageId}`,
        body,
    );
}

/**
 * ============================================================================
 * Delete Message
 * ============================================================================
 */

export async function deleteMessage(
    messageId: string,
) {
    return apiClient.delete<void>(
        `/api/messages/messages/${messageId}`,
    );
}