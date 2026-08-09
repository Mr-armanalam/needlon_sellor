import {ConversationDto} from "@/modules/message";
import React from "react";

export function MessageListSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex gap-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />

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
