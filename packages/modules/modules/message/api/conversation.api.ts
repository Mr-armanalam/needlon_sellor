// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/api/conversation.api.ts
// Description:
// Frontend API functions for conversation operations.
// ============================================================================

import {
    apiClient,
} from "@/modules/shared/api";

import {
    ConversationDto,
    CreateConversationDto,
    UpdateConversationDto,
} from "../dto";

export async function getConversations() {
    return apiClient.get<
        ConversationDto[]
    >(
        "/api/messages/conversations",
    );
}

export async function getConversation(
    conversationId: string,
) {
    return apiClient.get<
        ConversationDto
    >(
        `/api/messages/conversations/${conversationId}`,
    );
}

export async function createConversation(
    body: CreateConversationDto,
) {
    return apiClient.post<
        ConversationDto,
        CreateConversationDto
    >(
        "/api/messages/conversations",
        body,
    );
}

export async function updateConversation(
    conversationId: string,
    body: UpdateConversationDto,
) {
    return apiClient.patch<
        ConversationDto,
        UpdateConversationDto
    >(
        `/api/messages/conversations/${conversationId}`,
        body,
    );
}

export async function deleteConversation(
    conversationId: string,
) {
    return apiClient.delete<void>(
        `/api/messages/conversations/${conversationId}`,
    );
}

export async function searchConversations(
    query: string,
) {
    return apiClient.get<
        ConversationDto[]
    >(
        `/api/messages/conversations/search?q=${encodeURIComponent(query)}`,
    );
}