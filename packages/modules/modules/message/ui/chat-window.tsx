// ============================================================================
// Presentation component for displaying the active conversation and messages.
// ============================================================================

"use client";

import React from "react";

import { Trash } from "lucide-react";

import {
  ConversationDto,
  MessageDto,
} from "@/modules/message/dto";
import {getConversationDisplayName} from "@/modules/message/lib/get-conversation-display-name";
import {getConversationAvatarUrl} from "@/modules/message/lib/get-conversation-avatar-url";
import {getInitials} from "@/modules/message/lib/get-initials";
import {isConversationOnline} from "@/modules/message/lib/is-conversation-online";
import {MessageListSkeleton} from "@/modules/message/components/message-list-skeleton";
import {MessageEmptyState} from "@/modules/message/components/message-empty-state";
import {MessageItem} from "@/modules/message/section/message-items";

interface ChatWindowProps {
  conversation:
      ConversationDto | null;

  messages:
      MessageDto[];

  isLoading:
      boolean;

  isTyping?:
      boolean;

  onDeleteConversation?:
      (conversationId: string) => Promise<void>;

  onReply:
      (message: MessageDto) => void;
}

export default function ChatWindow(
    {
         conversation,
         messages,
         isLoading,
         isTyping,
         onDeleteConversation,
         onReply,
    }: ChatWindowProps
) {

  if (!conversation) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-0 bg-white">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Select a conversation
            </p>
          </div>
        </div>
    );
  }

  const displayName =
      getConversationDisplayName(
          conversation,
      );

  const avatarUrl =
      getConversationAvatarUrl(
          conversation,
      );

  return (
      <div className="flex-1 bg-slate-50 flex flex-col min-h-0">
        {/* 1. Chat Header */}
        <div className="flex items-center gap-3 p-5 border-b bg-white flex-shrink-0">
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500"
                >
                  {getInitials(
                      displayName,
                  )}
                </div>
            )}

            {isConversationOnline(
                conversation,
            ) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {displayName}
            </h2>

            <p className="text-xs text-gray-400">
              {conversation?.members?.find(m => m.sellerId !== conversation.currentSellerId)?.role === 'BUYER' ? 'Customer' : 'Seller'}
            </p>
          </div>

          {onDeleteConversation && (
            <div className="ml-auto">
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this conversation?")) {
                    await onDeleteConversation(conversation.id);
                  }
                }}
                aria-label="Delete Conversation"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {isLoading ? (
              <MessageListSkeleton />
          ) : messages.length === 0 ? (
              <MessageEmptyState />
          ) : (
              <>
                {messages.map(
                    (message) => (
                        <MessageItem
                            key={
                              message.id
                            }
                            message={
                              message
                            }
                            onReply={onReply}
                        />
                    ),
                )}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
                    <div className="flex-shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                          {getInitials(displayName)}
                        </div>
                      )}
                    </div>
                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </>
          )}
        </div>
      </div>
  );
}

