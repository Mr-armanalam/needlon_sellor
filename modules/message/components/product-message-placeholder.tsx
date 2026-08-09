import {ShoppingBag} from "lucide-react";
import React from "react";

interface ProductMessagePlaceholderProps {
    isOwnMessage:
        boolean;
}

export function ProductMessagePlaceholder({
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