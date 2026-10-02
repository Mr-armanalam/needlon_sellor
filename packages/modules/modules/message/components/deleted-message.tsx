import React from "react";

interface DeletedMessageProps {
    isOwnMessage:
        boolean;
}

export function DeletedMessage({
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

