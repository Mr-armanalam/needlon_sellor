import {MessageDto} from "@/modules/message";
import {ShoppingBag} from "lucide-react";
import React from "react";
import {ProductMessagePlaceholder} from "@/modules/message/components/product-message-placeholder";

interface ProductMessageProps {
    message: MessageDto;
    isOwnMessage: boolean;
}

export function ProductMessage({ message, isOwnMessage }: ProductMessageProps) {
    const prod = message.sharedProduct;
    if (!prod) {
        return <ProductMessagePlaceholder isOwnMessage={isOwnMessage} />;
    }

    const price = prod.variant ? `${prod.variant.currency} ${prod.variant.sellingPrice}` : "";

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-3 max-w-sm ${isOwnMessage ? 'ml-auto' : ''}`}>
            <img src={prod.thumbnailUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150"} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-900 truncate">{prod.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{price}</p>
                </div>
                <button className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
                    <ShoppingBag className="w-3.5 h-3.5" /> View Product
                </button>
            </div>
        </div>
    );
}