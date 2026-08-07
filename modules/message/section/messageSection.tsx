"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import ConversationList from "../view/conversion-list";
import ChatWindow from "../view/chat-window";
import MessageInput from "../view/message-input";

import {
  useConversationsQuery,
  useConversationSearchQuery,
  useConversationQuery,
  useMessagesQuery,
  useSendMessageMutation,
  useNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/modules/message/hooks";

import {
  MessageDto,
  SendMessageDto,
} from "@/modules/message/dto";

import {
  MessageType,
} from "@/db/schema/messages";

export default function MessagePage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState<string | null>(null);

  const [
    notificationVisible,
    setNotificationVisible,
  ] = useState(true);

  const conversationsQuery =
      useConversationsQuery();

  const conversationSearchQuery =
      useConversationSearchQuery(
          search,
      );

  const conversationQuery =
      useConversationQuery(
          activeConversationId,
      );

  const messagesQuery =
      useMessagesQuery(
          activeConversationId,
      );

  const sendMessageMutation =
      useSendMessageMutation();

  const notificationsQuery =
      useNotificationsQuery();

  const markNotificationReadMutation =
      useMarkNotificationReadMutation();

  const conversations =
      search.trim()
          ? conversationSearchQuery.conversations
          : conversationsQuery.conversations;

  const messages =
      messagesQuery.messages ?? [];

  const notification =
      notificationsQuery.notifications?.find(
          (item) =>
              !item.isRead,
      ) ?? null;

  /*
   * Select the first available conversation when
   * the conversation list is initially loaded.
   */
  useEffect(() => {
    if (
        activeConversationId ||
        !conversations?.length
    ) {
      return;
    }

    setActiveConversationId(
        conversations[0].id,
    );
  }, [
    activeConversationId,
    conversations,
  ]);

  /*
   * Keep the selected conversation valid after
   * searching or refreshing the conversation list.
   */
  useEffect(() => {
    if (
        !activeConversationId ||
        !conversations?.length
    ) {
      return;
    }

    const exists =
        conversations.some(
            (conversation) =>
                conversation.id ===
                activeConversationId,
        );

    if (!exists) {
      setActiveConversationId(
          conversations[0].id,
      );
    }
  }, [
    activeConversationId,
    conversations,
  ]);

  const activeConversation =
      conversationQuery.conversation ??
      conversations?.find(
          (conversation) =>
              conversation.id ===
              activeConversationId,
      ) ??
      null;

  const handleSelectConversation =
      (
          conversationId: string,
      ) => {
        setActiveConversationId(
            conversationId,
        );
      };

  const handleSendMessage =
      async (
          text: string,
      ) => {
        if (
            !activeConversationId ||
            !text.trim()
        ) {
          return;
        }

        const payload: SendMessageDto = {
          conversationId:
          activeConversationId,

          messageType:
          MessageType.TEXT,

          body:
              text.trim(),

          replyToMessageId:
              null,

          attachments: [],

          sharedProduct:
              null,

          sharedOrder:
              null,
        };

        await sendMessageMutation.mutateAsync(
            payload,
        );
      };

  const handleQuickReply =
      (
          reply: string,
      ) => {
        void handleSendMessage(
            reply,
        );
      };

  const handleDismissNotification =
      async () => {
        if (
            notification &&
            !notification.isRead
        ) {
          await markNotificationReadMutation.mutateAsync(
              notification.id,
          );
        }

        setNotificationVisible(
            false,
        );
      };

  const notificationState =
      useMemo(
          () => ({
            show:
                notificationVisible &&
                notification !== null,

            title:
                notification?.title ??
                "",

            desc:
                notification?.body ??
                "",
          }),
          [
            notificationVisible,
            notification,
          ],
      );

  return (
      <div className="flex flex-1 min-h-0 relative">
        {notificationState.show && (
            <div className="absolute top-6 right-6 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 max-w-sm flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {
                    notificationState.title
                  }
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  {
                    notificationState.desc
                  }
                </p>
              </div>

              <button
                  type="button"
                  onClick={
                    handleDismissNotification
                  }
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
        )}

        <div className="flex flex-1 w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-0">
          <ConversationList
              conversations={
                  conversations ?? []
              }
              activeId={
                activeConversationId
              }
              search={search}
              onSearchChange={
                setSearch
              }
              onSelectConversation={
                handleSelectConversation
              }
              isLoading={
                  conversationsQuery.isLoading ||
                  conversationSearchQuery.isLoading
              }
          />

          <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
            <ChatWindow
                conversation={
                  activeConversation
                }
                messages={messages}
                isLoading={
                  messagesQuery.isLoading
                }
            />

            <MessageInput
                onSendMessage={
                  handleSendMessage
                }
                onQuickReplyClick={
                  handleQuickReply
                }
                isSending={
                  sendMessageMutation.isPending
                }
            />
          </div>
        </div>
      </div>
  );
}



















// 'use client'
// import React, { useState } from 'react';
// import { Bell, X } from 'lucide-react';
// import ConversationList from '../view/conversion-list';
// import ChatWindow from '../view/chat-window';
// import MessageInput from '../view/message-input';
//
// const initialMessages = [
//   {
//     id: 1,
//     sender: 'them',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
//     text: "Hi there! I had some questions about my recent interaction with the storefront.",
//     time: '12:40 PM',
//     status: 'read'
//   },
//   {
//     id: 2,
//     sender: 'them',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
//     type: 'product',
//     product: {
//       title: 'Minimalist Leather Sneakers',
//       price: '$120.00',
//       image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300'
//     },
//     time: '12:41 PM',
//     status: 'read'
//   },
//   {
//     id: 3,
//     sender: 'me',
//     text: "Hello Sarah! Sure, I can help you with that. Are you checking on the sizing or delivery timeline?",
//     time: '12:43 PM',
//     status: 'read'
//   },
//   {
//     id: 4,
//     sender: 'them',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
//     type: 'order',
//     order: {
//       id: 'ORD-2026-1024',
//       status: 'In Transit',
//       date: 'July 2nd, 2026'
//     },
//     time: '12:45 PM',
//     status: 'delivered'
//   }
// ];
//
// export default function MessagePage() {
//   const [messages, setMessages] = useState(initialMessages);
//   const [activeConversationId, setActiveConversationId] = useState(1);
//   const [isTyping, setIsTyping] = useState(false);
//   const [notification, setNotification] = useState({
//     show: true,
//     title: 'New Event Logged',
//     desc: 'Sarah Jenkins referenced Order ORD-2026-1024'
//   });
//
//   const handleSendMessage = (textString) => {
//     const newMsg = {
//       id: Date.now(),
//       sender: 'me',
//       text: textString,
//       time: 'Just now',
//       status: 'sent'
//     };
//
//     setMessages((prev) => [...prev, newMsg]);
//     triggerBotSimulation();
//   };
//
//   const handleQuickReply = (replyText) => {
//     handleSendMessage(replyText);
//   };
//
//   const triggerBotSimulation = () => {
//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 1,
//           sender: 'them',
//           avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
//           text: "Thank you for looking into this! Please let me know when it arrives.",
//           time: 'Just now',
//           status: 'read'
//         }
//       ]);
//     }, 2000);
//   };
//
//   return (
//     <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden font-sans antialiased relative p-4 bg-slate-50">
//
//       {notification.show && (
//         <div className="absolute top-6 right-6 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 max-w-sm flex items-start gap-3">
//           <div className="flex-1 min-w-0">
//             <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
//             <p className="text-xs text-gray-500 mt-0.5">{notification.desc}</p>
//           </div>
//           <button
//             onClick={() => setNotification({ ...notification, show: false })}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}
//
//       {/* Main Grid Wrapper with fixed inner constraints */}
//       <div className="flex flex-1 w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-0">
//
//         <ConversationList
//           activeId={activeConversationId}
//           onSelectConversation={setActiveConversationId}
//         />
//
//         {/* This container prevents overflow breaking */}
//         <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
//           <ChatWindow
//             messages={messages}
//             isTyping={isTyping}
//           />
//           <MessageInput
//             onSendMessage={handleSendMessage}
//             onQuickReplyClick={handleQuickReply}
//           />
//         </div>
//
//       </div>
//     </div>
//   );
// }