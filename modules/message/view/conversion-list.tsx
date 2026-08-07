// ============================================================================
// Needlon
// Messages Module
// File: modules/message/view/conversion-list.tsx
// Description:
// Presentation component for displaying and searching conversations.
// ============================================================================

"use client";

import React from "react";

import {
  Check,
  Search,
} from "lucide-react";

import {
  ConversationDto,
} from "@/modules/message/dto";

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

export default function ConversationList({
                                           conversations,
                                           activeId,
                                           search,
                                           onSearchChange,
                                           onSelectConversation,
                                           isLoading,
                                         }: ConversationListProps) {
  return (
      <div className="w-[380px] flex-shrink-0 flex flex-col border-r border-gray-100 min-h-0">
        {/* Header & Search */}
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Messages
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

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

interface ConversationListItemProps {
  conversation:
      ConversationDto;

  active:
      boolean;

  onSelect:
      (
          conversationId: string,
      ) => void;
}

function ConversationListItem({
                                conversation,
                                active,
                                onSelect,
                              }: ConversationListItemProps) {
  const lastMessage =
      conversation.lastMessage;

  const displayName =
      getConversationDisplayName(
          conversation,
      );

  const avatarUrl =
      getConversationAvatarUrl(
          conversation,
      );

  const preview =
      getLastMessagePreview(
          conversation,
      );

  const time =
      formatConversationTime(
          lastMessage?.createdAt ??
          conversation.updatedAt,
      );

  const isOwnLastMessage =
      lastMessage?.senderId ===
      conversation.currentSellerId;

  return (
      <button
          type="button"
          onClick={() =>
              onSelect(
                  conversation.id,
              )
          }
          aria-current={
            active
                ? "true"
                : undefined
          }
          className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
              active
                  ? "bg-blue-50/60 hover:bg-blue-50/60"
                  : ""
          }`}
      >
        {/* Avatar block with online indicator */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
              <img
                  src={avatarUrl}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover"
              />
          ) : (
              <div
                  aria-hidden="true"
                  className="w-11 h-11 rounded-full object-cover bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500"
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

        {/* Info details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {displayName}
            </h2>

            <span className="text-xs text-gray-400 whitespace-nowrap">
                        {time}
                    </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <p
                className={`text-xs truncate ${
                    conversation.unreadCount >
                    0
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                }`}
            >
              {preview}
            </p>

            {conversation.unreadCount >
            0 ? (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                            {
                              conversation.unreadCount
                            }
                        </span>
            ) : (
                isOwnLastMessage && (
                    <Check className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                )
            )}
          </div>
        </div>
      </button>
  );
}

function ConversationListSkeleton() {
  return (
      <>
        {Array.from({
          length: 4,
        }).map(
            (_, index) => (
                <div
                    key={index}
                    className="w-full p-4 flex items-start gap-3"
                >
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="h-3.5 w-28 bg-gray-100 rounded" />
                      <div className="h-3 w-12 bg-gray-100 rounded" />
                    </div>

                    <div className="h-3 w-40 bg-gray-100 rounded" />
                  </div>
                </div>
            ),
        )}
      </>
  );
}

interface ConversationListEmptyStateProps {
  hasSearch:
      boolean;
}

function ConversationListEmptyState({
                                      hasSearch,
                                    }: ConversationListEmptyStateProps) {
  return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">
          {hasSearch
              ? "No conversations found."
              : "No conversations yet."}
        </p>
      </div>
  );
}

function getConversationDisplayName(
    conversation: ConversationDto,
): string {
  if (conversation.title) {
    return conversation.title;
  }

  const otherMember =
      conversation.members.find(
          (member) =>
              member.sellerId !==
              conversation.currentSellerId,
      );

  return (
      otherMember?.displayName ??
      "Conversation"
  );
}

function getConversationAvatarUrl(
    conversation: ConversationDto,
): string | null {
  if (conversation.avatarUrl) {
    return conversation.avatarUrl;
  }

  const otherMember =
      conversation.members.find(
          (member) =>
              member.sellerId !==
              conversation.currentSellerId,
      );

  return (
      otherMember?.avatarUrl ??
      null
  );
}

function isConversationOnline(
    conversation: ConversationDto,
): boolean {
  return conversation.members.some(
      (member) =>
          member.sellerId !==
          conversation.currentSellerId &&
          member.isOnline,
  );
}

function getLastMessagePreview(
    conversation: ConversationDto,
): string {
  const lastMessage =
      conversation.lastMessage;

  if (!lastMessage) {
    return "No messages yet";
  }

  if (lastMessage.isDeleted) {
    return "Message deleted";
  }

  if (lastMessage.body) {
    return lastMessage.body;
  }

  return getMessageTypeLabel(
      lastMessage.messageType,
  );
}

function getMessageTypeLabel(
    messageType: string,
): string {
  switch (
      messageType
      ) {
    case "PRODUCT":
      return "Shared a product";

    case "ORDER":
      return "Shared an order";

    case "IMAGE":
      return "Sent an image";

    case "FILE":
      return "Sent an attachment";

    default:
      return "New message";
  }
}

function formatConversationTime(
    value: string,
): string {
  const date =
      new Date(value);

  if (
      Number.isNaN(
          date.getTime(),
      )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      },
  ).format(date);
}

function getInitials(
    name: string,
): string {
  return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
          (part) =>
              part.charAt(0),
      )
      .join("")
      .toUpperCase();
}














// import React, { useState } from 'react';
// import { Search, Check, CheckCheck, Circle } from 'lucide-react';
//
// const mockConversations = [
//   {
//     id: 1,
//     name: 'Sarah Jenkins',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
//     lastMessage: 'Is the order #1024 shipped yet?',
//     time: '12:45 PM',
//     unread: 2,
//     online: true,
//     status: 'delivered'
//   },
//   {
//     id: 2,
//     name: 'Alex Rivera',
//     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
//     lastMessage: 'Thanks for the quick update!',
//     time: '10:30 AM',
//     unread: 0,
//     online: false,
//     status: 'read'
//   }
// ];
//
// export default function ConversationList({ onSelectConversation, activeId }) {
//   const [search, setSearch] = useState('');
//
//   return (
//     <div className="w-full md:w-80 h-full border-r border-gray-200 bg-white flex flex-col">
//       {/* Header & Search */}
//       <div className="p-4 border-b border-gray-100">
//         <h1 className="text-xl font-bold text-gray-800 mb-3">Messages</h1>
//         <div className="relative">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transitional-all"
//           />
//         </div>
//       </div>
//
//       {/* List */}
//       <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
//         {mockConversations.map((chat) => (
//           <button
//             key={chat.id}
//             onClick={() => onSelectConversation(chat.id)}
//             className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
//               activeId === chat.id ? 'bg-blue-50/60 hover:bg-blue-50/60' : ''
//             }`}
//           >
//             {/* Avatar block with online indicator */}
//             <div className="relative flex-shrink-0">
//               <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover" />
//               {chat.online && (
//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
//               )}
//             </div>
//
//             {/* Info details */}
//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-baseline mb-1">
//                 <h2 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h2>
//                 <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
//               </div>
//
//               <div className="flex items-center justify-between gap-1">
//                 <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                   {chat.lastMessage}
//                 </p>
//
//                 {chat.unread > 0 ? (
//                   <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
//                     {chat.unread}
//                   </span>
//                 ) : (
//                   chat.status === 'read' ? (
//                     <CheckCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
//                   ) : (
//                     <Check className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
//                   )
//                 )}
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }