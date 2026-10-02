import React from 'react';
import {Eye, Heart, ShoppingBag} from "lucide-react";
import {ProductCardViewModel} from "@/modules/products";

const ProductFooterTricker = ({product}:{product:ProductCardViewModel}) => {
    return (
        <div className="grid grid-cols-3 gap-1 border-t border-neutral-100 pt-3 text-center text-neutral-400">
            <div className="flex flex-col items-center justify-center">
                <Eye size={13} />
                <span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.views}</span>
                <span className="text-[9px] font-medium tracking-tight">Views</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Heart size={13} />
                <span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.likes}</span>
                <span className="text-[9px] font-medium tracking-tight">Likes</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <ShoppingBag size={13} />
                <span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.orders}</span>
                <span className="text-[9px] font-medium tracking-tight">Orders</span>
            </div>
        </div>
    );
};

export default ProductFooterTricker;