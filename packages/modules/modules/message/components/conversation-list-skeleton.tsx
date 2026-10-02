import React from "react";

export function ConversationListSkeleton() {
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