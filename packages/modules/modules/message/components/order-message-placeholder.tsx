import {MessageDto} from "@/modules/message";
import {Package} from "lucide-react";

interface OrderMessagePlaceholderProps {
    isOwnMessage:
        boolean;
}

export function OrderMessagePlaceholder({
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