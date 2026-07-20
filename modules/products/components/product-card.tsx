'use client';

import React from 'react';
import { Star, Edit3, Copy, Share2, Trash2, Eye, Heart, ShoppingBag } from 'lucide-react';
import { ProductCardViewModel } from '../types';

interface ProductCardProps {
  product: ProductCardViewModel;
  onDuplicate: (product: ProductCardViewModel) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDuplicate, onDelete }: ProductCardProps) {
  return (
    <div className="group relative bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.03)] animate-fade-in">
      
      {/* Aspect Square Image Canvas Box */}
      <div className="relative w-full aspect-square rounded-xl bg-neutral-50 border border-neutral-100/70 overflow-hidden flex items-center justify-center select-none">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-[22px] font-bold shadow-inner transition-transform duration-500 group-hover:scale-105 ${product.bg}`}>
          {product.initials}
        </div>

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
          <button title="Edit Product" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Edit3 size={14} /></button>
          <button onClick={() => onDuplicate(product)} title="Duplicate Product" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Copy size={14} /></button>
          <button title="Share Showcase Link" className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Share2 size={14} /></button>
          <button onClick={() => onDelete(product.id)} title="Delete Product" className="p-2.5 bg-white text-red-500 hover:text-red-600 rounded-xl shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 outline-none"><Trash2 size={14} /></button>
        </div>
      </div>

      {/* Core Contextual Meta Text Details */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{product.category} • {product.subcategory}</span>
        <h4 className="text-[14px] font-semibold text-neutral-800 tracking-tight group-hover:text-neutral-900 transition-colors line-clamp-1 mt-0.5">{product.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[15px] font-bold text-neutral-900">{product.price}</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{product.discount}</span>
        </div>
        <span className={`text-[11px] font-medium mt-1.5 ${product.stock === 0 ? 'text-red-500 font-semibold' : 'text-neutral-400'}`}>
          {product.stock === 0 ? 'Out of stock' : `${product.stock} pieces left in boutique`}
        </span>
      </div>

      {/* Integrated Micro-Analytics Footer Ticker */}
      <div className="grid grid-cols-3 gap-1 border-t border-neutral-100 pt-3 text-center text-neutral-400">
        <div className="flex flex-col items-center justify-center"><Eye size={13} /><span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.views}</span><span className="text-[9px] font-medium tracking-tight">Views</span></div>
        <div className="flex flex-col items-center justify-center"><Heart size={13} /><span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.likes}</span><span className="text-[9px] font-medium tracking-tight">Likes</span></div>
        <div className="flex flex-col items-center justify-center"><ShoppingBag size={13} /><span className="text-[11px] font-bold text-neutral-700 mt-0.5">{product.orders}</span><span className="text-[9px] font-medium tracking-tight">Orders</span></div>
      </div>

    </div>
  );
}
