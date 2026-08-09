import {MessageDto} from "@/modules/message";
import {CornerUpLeft} from "lucide-react";
import React from "react";
import {getInitials} from "@/modules/message/lib/get-initials";
import {DeletedMessage} from "@/modules/message/components/deleted-message";
import {ReplyPreview} from "@/modules/message/components/reply-preview";
import {TextMessage} from "@/modules/message/components/text-message";
import {ProductMessage} from "@/modules/message/components/product-message";
import {OrderMessage} from "@/modules/message/components/order-message";
import {AttachmentSummary} from "@/modules/message/components/attachement-summary";
import {MessageMeta} from "@/modules/message/components/message-meta";

interface MessageItemProps {
    message:
        MessageDto;
    onReply:
        (message: MessageDto) => void;
}

export function MessageItem({
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