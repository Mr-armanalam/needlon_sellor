// ============================================================================
// Needlon
// Messages Module
// File: modules/message/view/chat-window.tsx
// Description:
// Presentation component for displaying the active conversation and messages.
// ============================================================================

"use client";

import React from "react";

import {
  Check,
  CheckCheck,
  Package,
  ShoppingBag,
  Trash,
  CornerUpLeft,
  FileText,
  Download,
} from "lucide-react";

import {
  ConversationDto,
  MessageDto,
} from "@/modules/message/dto";

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

export default function ChatWindow({
                                     conversation,
                                     messages,
                                     isLoading,
                                     isTyping,
                                     onDeleteConversation,
                                     onReply,
                                   }: ChatWindowProps) {
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

interface MessageItemProps {
  message:
      MessageDto;
  onReply:
      (message: MessageDto) => void;
}

function MessageItem({
                       message,
                       onReply,
                     }: MessageItemProps) {
  const isMe =
      message.isOwnMessage;

  const senderAvatar =
      message.sender.avatarUrl;

  return (
      <div
          className={`group flex gap-3 max-w-[85%] md:max-w-[70%] relative ${
              isMe
                  ? "ml-auto flex-row-reverse"
                  : ""
          }`}
      >
        {!isMe && (
            <div className="flex-shrink-0">
              {senderAvatar ? (
                  <img
                      src={senderAvatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover mt-0.5"
                  />
              ) : (
                  <div
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500 mt-0.5"
                  >
                    {getInitials(
                        message.sender
                            .name,
                    )}
                  </div>
              )}
            </div>
        )}

        <div className="space-y-2 min-w-0">
          {message.isDeleted ? (
              <DeletedMessage
                  isOwnMessage={
                    isMe
                  }
              />
          ) : (
              <>
                {message.replyTo && (
                    <ReplyPreview
                        message={
                          message
                        }
                    />
                )}

                {message.body && (
                    <TextMessage
                        message={
                          message
                        }
                    />
                )}

                {message.messageType ===
                    "PRODUCT" && (
                        <ProductMessage
                            message={message}
                            isOwnMessage={
                              isMe
                            }
                        />
                    )}

                {message.messageType ===
                    "ORDER" && (
                        <OrderMessage
                            message={message}
                            isOwnMessage={
                              isMe
                            }
                        />
                    )}

                {message.attachments
                        .length >
                    0 && (
                        <AttachmentSummary
                            message={
                              message
                            }
                        />
                    )}
              </>
          )}

          <MessageMeta
              message={
                message
              }
          />
        </div>

        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center flex-shrink-0 ${isMe ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => onReply(message)}
            title="Reply"
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CornerUpLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
  );
}

interface TextMessageProps {
  message:
      MessageDto;
}

function TextMessage({
                       message,
                     }: TextMessageProps) {
  const isMe =
      message.isOwnMessage;

  return (
      <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              isMe
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 rounded-tl-none"
          }`}
      >
        {message.body}
      </div>
  );
}

interface ReplyPreviewProps {
  message:
      MessageDto;
}

function ReplyPreview({
                        message,
                      }: ReplyPreviewProps) {
  if (!message.replyTo) {
    return null;
  }

  return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 max-w-sm">
        <p className="text-[11px] font-semibold text-gray-600 truncate">
          {message.replyTo.senderName}
        </p>

        <p className="text-xs text-gray-500 truncate mt-0.5">
          {message.replyTo.isDeleted
              ? "Message deleted"
              : message.replyTo.body ??
              getMessageTypeLabel(
                  message.replyTo
                      .messageType,
              )}
        </p>
      </div>
  );
}

interface DeletedMessageProps {
  isOwnMessage:
      boolean;
}

function DeletedMessage({
                          isOwnMessage,
                        }: DeletedMessageProps) {
  return (
      <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm italic ${
              isOwnMessage
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-400 rounded-tl-none"
          }`}
      >
        Message deleted
      </div>
  );
}

interface ProductMessageProps {
  message: MessageDto;
  isOwnMessage: boolean;
}

function ProductMessage({ message, isOwnMessage }: ProductMessageProps) {
  const prod = message.sharedProduct;
  if (!prod) {
    return <ProductMessagePlaceholder isOwnMessage={isOwnMessage} />;
  }

  const price = prod.variant ? `${prod.variant.currency} ${prod.variant.sellingPrice}` : "";

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-3 max-w-sm ${isOwnMessage ? 'ml-auto' : ''}`}>
      <img src={prod.thumbnailUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150"} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900 truncate">{prod.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{price}</p>
        </div>
        <button className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
          <ShoppingBag className="w-3.5 h-3.5" /> View Product
        </button>
      </div>
    </div>
  );
}

interface OrderMessageProps {
  message: MessageDto;
  isOwnMessage: boolean;
}

function OrderMessage({ message, isOwnMessage }: OrderMessageProps) {
  const ord = message.sharedOrder;
  if (!ord) {
    return <OrderMessagePlaceholder isOwnMessage={isOwnMessage} />;
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm max-w-sm ${isOwnMessage ? 'ml-auto' : ''}`}>
      <div className="flex items-center justify-between border-b border-gray-50 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-gray-900">{ord.orderNumber}</span>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          {ord.fulfillmentStatus === "SHIPPED" ? "In Transit" : ord.fulfillmentStatus}
        </span>
      </div>
      <p className="text-xs text-gray-500">Total: <span className="font-medium text-gray-800">{ord.currency} {ord.grandTotal}</span></p>
    </div>
  );
}

interface ProductMessagePlaceholderProps {
  isOwnMessage:
      boolean;
}

function ProductMessagePlaceholder({
                                     isOwnMessage,
                                   }: ProductMessagePlaceholderProps) {
  /*
   * MessageDto currently exposes messageType but does not expose
   * SharedProductDto. Do not fabricate product data.
   *
   * This keeps the presentation compatible with the published
   * communication contract until the response contract includes
   * the shared product representation.
   */
  return (
      <div
          className={`bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-3 max-w-sm ${
              isOwnMessage
                  ? "ml-auto"
                  : ""
          }`}
      >
        <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-6 h-6 text-gray-400" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            Shared product
          </h4>

          <p className="text-xs text-gray-500 mt-0.5">
            Product details unavailable
          </p>
        </div>
      </div>
  );
}

interface OrderMessagePlaceholderProps {
  isOwnMessage:
      boolean;
}

function OrderMessagePlaceholder({
                                   isOwnMessage,
                                 }: OrderMessagePlaceholderProps) {
  /*
   * MessageDto currently exposes messageType but does not expose
   * SharedOrderDto. Do not fabricate order data.
   */
  return (
      <div
          className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm max-w-sm ${
              isOwnMessage
                  ? "ml-auto"
                  : ""
          }`}
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />

          <span className="text-xs font-semibold text-gray-900">
                    Shared order
                </span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Order details unavailable
        </p>
      </div>
  );
}

interface AttachmentSummaryProps {
  message:
      MessageDto;
}

function AttachmentSummary({
                             message,
                           }: AttachmentSummaryProps) {
  const isMe = message.isOwnMessage;
  return (
      <div className={`flex flex-col gap-2 max-w-sm ${isMe ? 'items-end' : 'items-start'}`}>
        {message.attachments.map((att) => {
          const isImage = att.attachmentType === "IMAGE" || att.mimeType?.startsWith("image/");
          
          if (isImage) {
            return (
              <a
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:opacity-95 transition-opacity"
              >
                <img src={att.url} alt={att.fileName} className="max-w-[240px] max-h-[180px] object-cover bg-gray-50" />
              </a>
            );
          }

          return (
            <div key={att.id} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{att.fileName}</p>
                <p className="text-[10px] text-gray-400">{(att.fileSize / 1024).toFixed(1)} KB</p>
              </div>
              <a
                href={att.url}
                download={att.fileName}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>
  );
}

interface MessageMetaProps {
  message:
      MessageDto;
}

function MessageMeta({
                       message,
                     }: MessageMetaProps) {
  const isMe =
      message.isOwnMessage;

  const createdAt =
      formatMessageTime(
          message.createdAt,
      );

  return (
      <div
          className={`flex items-center gap-1.5 text-[10px] text-gray-400 ${
              isMe
                  ? "justify-end"
                  : ""
          }`}
      >
            <span>
                {createdAt}
            </span>

        {message.isEdited && (
            <span>
                    · edited
                </span>
        )}

        {isMe && (
            <MessageStatusIcon
                message={
                  message
                }
            />
        )}
      </div>
  );
}

interface MessageStatusIconProps {
  message:
      MessageDto;
}

function MessageStatusIcon({
                             message,
                           }: MessageStatusIconProps) {
  if (
      message.isReadByEveryone
  ) {
    return (
        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
    );
  }

  return (
      <Check className="w-3.5 h-3.5 text-gray-300" />
  );
}

function MessageListSkeleton() {
  return (
      <div className="space-y-6">
        <div className="flex gap-3 max-w-[70%]">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />

          <div className="space-y-2">
            <div className="h-12 w-64 bg-gray-100 rounded-2xl" />
            <div className="h-3 w-12 bg-gray-100 rounded" />
          </div>
        </div>

        <div className="flex gap-3 max-w-[70%] ml-auto flex-row-reverse">
          <div className="space-y-2">
            <div className="h-12 w-72 bg-gray-100 rounded-2xl" />
            <div className="h-3 w-12 bg-gray-100 rounded ml-auto" />
          </div>
        </div>

        <div className="flex gap-3 max-w-[70%]">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />

          <div className="space-y-2">
            <div className="h-16 w-56 bg-gray-100 rounded-2xl" />
            <div className="h-3 w-12 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
  );
}

function MessageEmptyState() {
  return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">
          No messages yet.
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

function formatMessageTime(
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











// import React from 'react';
// import { ShoppingBag, Package, Check, CheckCheck, MoreVertical } from 'lucide-react';
//
// export default function ChatWindow({ messages, isTyping }) {
//   return (
//     <div className="flex-1 flex flex-col h-full bg-slate-50 min-h-0">
//       {/* 1. Chat Header (Audio/Video removed for Seller Dashboard) */}
//       <div className="h-16 px-6 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <img
//               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
//               alt="Sarah Jenkins"
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
//           </div>
//           <div>
//             <h2 className="text-sm font-semibold text-gray-900">Sarah Jenkins</h2>
//             <p className="text-xs text-gray-400">Customer</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 text-gray-500">
//           <button className="hover:text-gray-700 transition-colors">
//             <MoreVertical className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//
//       {/* 2. Messages Stream */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
//         {messages.map((msg) => {
//           const isMe = msg.sender === 'me';
//           return (
//             <div key={msg.id} className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
//               {!isMe && (
//                 <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full object-cover mt-0.5 flex-shrink-0" />
//               )}
//
//               <div className="space-y-2">
//                 {msg.text && (
//                   <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
//                     isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
//                   }`}>
//                     {msg.text}
//                   </div>
//                 )}
//
//                 {msg.type === 'product' && msg.product && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-3 max-w-sm">
//                     <img src={msg.product.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
//                     <div className="flex-1 min-w-0 flex flex-col justify-between">
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-900 truncate">{msg.product.title}</h4>
//                         <p className="text-xs text-gray-500 mt-0.5">{msg.product.price}</p>
//                       </div>
//                       <button className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
//                         <ShoppingBag className="w-3.5 h-3.5" /> View Product
//                       </button>
//                     </div>
//                   </div>
//                 )}
//
//                 {msg.type === 'order' && msg.order && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm max-w-sm">
//                     <div className="flex items-center justify-between border-b border-gray-50 pb-2.5 mb-2.5">
//                       <div className="flex items-center gap-2">
//                         <Package className="w-4 h-4 text-blue-600" />
//                         <span className="text-xs font-semibold text-gray-900">{msg.order.id}</span>
//                       </div>
//                       <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
//                         {msg.order.status}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-500">Est. Delivery: <span className="font-medium text-gray-800">{msg.order.date}</span></p>
//                   </div>
//                 )}
//
//                 <div className={`flex items-center gap-1.5 text-[10px] text-gray-400 ${isMe ? 'justify-end' : ''}`}>
//                   <span>{msg.time}</span>
//                   {isMe && (
//                     msg.status === 'read' ? (
//                       <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
//                     ) : (
//                       <Check className="w-3.5 h-3.5 text-gray-300" />
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//
//         {isTyping && (
//           <div className="flex gap-3 items-center max-w-[70%]">
//             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" alt="" className="w-8 h-8 rounded-full object-cover" />
//             <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
//               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }