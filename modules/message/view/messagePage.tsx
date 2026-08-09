"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";


import ConversationList from "../ui/conversion-list";
import ChatWindow from "../ui/chat-window";
import MessageInput from "../ui/message-input";

import {
  useConversationsQuery,
  useConversationSearchQuery,
  useConversationQuery,
  useMessagesQuery,
  useSendMessageMutation,
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteConversationMutation,
} from "@/modules/message/hooks";

import {
  MessageDto,
  SendMessageDto,
} from "@/modules/message/dto";

import {
  MessageType,
} from "@/db/schema/messages";
import NotificationAlert from "@/modules/message/components/notification-alert";

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

  const [
    isTyping,
    setIsTyping,
  ] = useState(false);

  const [
    replyTarget,
    setReplyTarget,
  ] = useState<MessageDto | null>(null);

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

  const deleteConversationMutation =
      useDeleteConversationMutation();

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

    // setActiveConversationId(
    //     conversations[0].id,
    // );

      setTimeout(() => {
          setActiveConversationId(
              conversations[0].id,
          );
      }, 0);
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
      // setActiveConversationId(
      //     conversations[0].id,
      // );
        setTimeout(() => {
            setActiveConversationId(
                conversations[0].id,
            );
        }, 0);
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
        setReplyTarget(null);
        setActiveConversationId(
            conversationId,
        );
      };

  const handleDeleteConversation =
      async (conversationId: string) => {
        await deleteConversationMutation.mutateAsync(conversationId);
        setActiveConversationId(null);
        setReplyTarget(null);
      };

  const handleSendMessage =
      async (
          text: string,
          attachments: { attachmentId: string; sortOrder: number; }[] = [],
      ) => {
        if (
            !activeConversationId ||
            (!text.trim() && attachments.length === 0)
        ) {
          return;
        }

        const isImage = attachments.some(a => a.attachmentId && (a as any).type === "IMAGE");

        const payload: SendMessageDto = {
          conversationId:
          activeConversationId,

          messageType:
          attachments.length > 0 ? (isImage ? MessageType.IMAGE : MessageType.DOCUMENT) : MessageType.TEXT,

          body:
              text.trim() || null,

          replyToMessageId:
              replyTarget?.id || null,

          attachments: attachments,

          sharedProduct:
              null,

          sharedOrder:
              null,
        };

        setReplyTarget(null);

        await sendMessageMutation.mutateAsync(
            payload,
        );

        // Simulate typing animation from other participant
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
      };

  const handleQuickReply =
      (
          reply: string,
      ) => {
        void handleSendMessage(
            reply,
            [],
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
      <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden font-sans antialiased relative p-4 bg-slate-50">
        {notificationState.show && (
            <NotificationAlert
                notificationState={notificationState}
                handleDismissNotification={handleDismissNotification}
            />
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
                isTyping={isTyping}
                onDeleteConversation={handleDeleteConversation}
                onReply={setReplyTarget}
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
                replyTarget={replyTarget}
                onCancelReply={() => setReplyTarget(null)}
            />
          </div>
        </div>
      </div>
  );
}
