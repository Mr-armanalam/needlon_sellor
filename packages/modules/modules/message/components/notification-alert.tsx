import React from 'react';
import {X} from "lucide-react";

const NotificationAlert = (
    {
        notificationState,
        handleDismissNotification
    }: {
        notificationState: {
            title: string;
            desc: string;
        };
        handleDismissNotification: () => void;
    }
) => {
    return (
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
    );
};

export default NotificationAlert;