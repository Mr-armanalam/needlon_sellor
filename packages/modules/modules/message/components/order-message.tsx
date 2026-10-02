import {MessageDto} from "@/modules/message";
import {Package} from "lucide-react";
import React from "react";
import {OrderMessagePlaceholder} from "@/modules/message/components/order-message-placeholder";

interface OrderMessageProps {
    message: MessageDto;
    isOwnMessage: boolean;
}

export function OrderMessage({ message, isOwnMessage }: OrderMessageProps) {
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