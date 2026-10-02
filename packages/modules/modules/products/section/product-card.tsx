'use client';

import React from 'react';
import { ProductCardViewModel } from '../types';
import ProductImageCanvaBox from "@/modules/products/components/product-image-canva-box";
import ProductMetaTextDetails from "@/modules/products/components/product-meta-text-details";
import ProductFooterTricker from "@/modules/products/components/product-footer-tricker";


export function ProductCard({ product}: { product: ProductCardViewModel }) {
  return (
    <div className="group relative bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.03)] animate-fade-in">
      
      <ProductImageCanvaBox product={product} />
      {/* Core Contextual Meta Text Details */}
      <ProductMetaTextDetails product={product} />

      {/* Integrated Micro-Analytics Footer Ticker (Matches Attached Screenshot) */}
      <ProductFooterTricker product={product}/>

    </div>
  );
}
