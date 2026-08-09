// ============================================================================
// Presentation component for displaying and searching conversations.
// ============================================================================

"use client";

import React from "react";

import {
  Search,
} from "lucide-react";

import {
  ConversationDto,
} from "@/modules/message/dto";
import {ConversationListSkeleton} from "@/modules/message/components/conversation-list-skeleton";
import {ConversationListEmptyState} from "@/modules/message/components/coversation-list-empty-state";
import {ConversationListItem} from "@/modules/message/section/conversation-list-item";

interface ConversationListProps {
  conversations: ConversationDto[];

  activeId:
      string | null;

  search:
      string;

  onSearchChange:
      (value: string) => void;

  onSelectConversation:
      (conversationId: string) => void;

  isLoading:
      boolean;
}

export default function ConversationList(
    {
       conversations,
       activeId,
       search,
       onSearchChange,
       onSelectConversation,
       isLoading,
     }: ConversationListProps) {
  return (
      <div className="w-full md:w-80 h-full border-r border-gray-200 bg-white flex flex-col">
        {/* Header & Search */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 mb-3">
            Messages
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

            <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(event) =>
                    onSearchChange(
                        event.target.value,
                    )
                }
                aria-label="Search conversations"
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transitional-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {isLoading ? (
              <ConversationListSkeleton />
          ) : conversations.length === 0 ? (
              <ConversationListEmptyState
                  hasSearch={
                      search.trim().length > 0
                  }
              />
          ) : (
              conversations.map(
                  (conversation) => (
                      <ConversationListItem
                          key={
                            conversation.id
                          }
                          conversation={
                            conversation
                          }
                          active={
                              activeId ===
                              conversation.id
                          }
                          onSelect={
                            onSelectConversation
                          }
                      />
                  ),
              )
          )}
        </div>
      </div>
  );
}
