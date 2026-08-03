import React from 'react';
import {Copy, Edit3, Eye, Heart, Share2, ShoppingBag, Star, Trash2} from "lucide-react";
import {useProductUiSet} from "@/modules/products/hooks/use-product-ui-set";
import {ProductCardViewModel} from "@/modules/products";


const ProductImageCanvaBox = ({product}: {product:ProductCardViewModel}) => {
    const {
        handleShareProduct:onShare,
        removeProduct:onDelete,
        duplicateProduct:onDuplicate,
        handleEditProduct:onEdit
    } = useProductUiSet();

    return (
        <div className="relative w-full aspect-square rounded-xl bg-neutral-50 border border-neutral-100/70 overflow-hidden flex items-center justify-center select-none">
            {product.primaryImage ? (
                <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-[22px] font-bold shadow-inner transition-transform duration-500 group-hover:scale-105 ${product.bg}`}>
                    {product.initials}
                </div>
            )}

            {/* Left Float: Active Status Ticker */}
            <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
                product.status === 'Out of Stock' ? 'bg-red-50 text-red-600' : 'bg-white text-neutral-800'
            }`}>
          {product.status}
        </span>

            {/* Right Float: Interactive Star Rating Row */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-1 text-[11px] font-bold text-neutral-800">
                <Star size={10} className="fill-amber-400 stroke-amber-400" />
                <span>{product.rating}</span>
            </div>

            {/* Premium Backdrop Hover Tool Drawer */}
            <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button onClick={() => onEdit(product.id)} title="Edit Product" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Edit3 size={14} /></button>
                <button onClick={() => onDuplicate(product.id)} title="Duplicate Product" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Copy size={14} /></button>
                <button onClick={() => onShare(product)} title="Share Showcase Link" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Share2 size={14} /></button>
                <button onClick={() => onDelete(product.id)} title="Delete Product" className="p-2.5 bg-white text-red-500 hover:text-red-600 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Trash2 size={14} /></button>
            </div>
        </div>

    );
};

export default ProductImageCanvaBox;