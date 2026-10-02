import React from 'react';
import {ProductCardViewModel} from "@/modules/products";

const ProductMetaTextDetails = ({product}:{product:ProductCardViewModel}) => {
    return (
        <div className="flex flex-col gap-0.5 px-0.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{product.category} • {product.subcategory}</span>
            <h4 className="text-[14px] font-semibold text-neutral-800 tracking-tight group-hover:text-neutral-900 transition-colors line-clamp-1 mt-0.5">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[15px] font-bold text-neutral-900">{product.price}</span>
                {product.discount && product.discount !== "0% OFF" && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{product.discount}</span>
                )}
            </div>
            <span className={`text-[11px] font-medium mt-1.5 ${product.stock === 0 ? 'text-red-500 font-semibold' : 'text-neutral-400'}`}>
          {product.stock === 0 ? 'Out of stock' : `${product.stock} pieces left in boutique`}
        </span>
        </div>
    );
};

export default ProductMetaTextDetails;