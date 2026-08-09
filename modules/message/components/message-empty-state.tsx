import React from "react";

export function MessageEmptyState() {
    return (
        <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-500">
                No messages yet.
            </p>
        </div>
    );
}