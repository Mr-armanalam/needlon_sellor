import {MessageDto} from "@/modules/message";
import React from "react";

interface TextMessageProps {
    message:
        MessageDto;
}

export function TextMessage({
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