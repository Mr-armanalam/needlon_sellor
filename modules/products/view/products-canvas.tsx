import React, { useState } from "react";
import {
  Plus,
  SlidersHorizontal,
  Eye,
  Heart,
  ShoppingBag,
  Edit3,
  Share2,
  Trash2,
  ChevronDown,
} from "lucide-react";

export default function ProductsCanvas() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Active", "Draft", "Out of Stock", "Archived"];
  const filterOptions = ["Category", "Size", "Price", "Stock", "Status"];

  const products = [
    {
      id: 1,
      name: "Handloom Chikankari Kurti",
      price: "₹2,450",
      discount: "10% OFF",
      stock: 14,
      views: 520,
      likes: 84,
      orders: 32,
      tag: "Active",
      bg: "bg-orange-50 text-orange-700",
      initials: "CK",
    },
    {
      id: 2,
      name: "Pure Cotton Indigo Shirt",
      price: "₹1,850",
      discount: "5% OFF",
      stock: 2,
      views: 340,
      likes: 41,
      orders: 18,
      tag: "Out of Stock",
      bg: "bg-blue-50 text-blue-700",
      initials: "IS",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight">
            Products
          </h2>
          <p className="text-[13px] text-neutral-400 font-normal">
            Manage your boutique shelves and inventory availability.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm outline-none group">
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. NAVIGATION TABS & FILTERS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-1">
        {/* Status Tabs (Apple Navigation Style) */}
        <div className="flex items-center gap-1 bg-neutral-100/70 p-1 rounded-xl max-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 outline-none ${
                activeTab === tab
                  ? "bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lightweight Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[13px] font-semibold pr-2 border-r border-neutral-200/80 mr-1 shrink-0">
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </div>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className="px-3 py-1.5 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 outline-none shrink-0"
            >
              <span>{filter}</span>
              <ChevronDown size={12} className="text-neutral-400" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. PRODUCT BOUTIQUE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.03)]"
          >
            {/* Top Layout Block: Frame & Hover Controls */}
            <div className="relative w-full aspect-square rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center select-none">
              {/* Product Visual Mock Frame */}
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-[22px] font-bold shadow-inner transition-transform duration-500 group-hover:scale-105 ${product.bg}`}
              >
                {product.initials}
              </div>

              {/* Status Ticker Anchor */}
              <span
                className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
                  product.tag === "Out of Stock"
                    ? "bg-red-50 text-red-600"
                    : "bg-white text-neutral-800"
                }`}
              >
                {product.tag}
              </span>

              {/* Disappear Trigger Layer: Actions revealed on desktop hover */}
              <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button
                  title="Edit Item"
                  className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 outline-none"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  title="Share Link"
                  className="p-2.5 bg-white text-neutral-800 hover:text-neutral-900 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 outline-none"
                >
                  <Share2 size={15} />
                </button>
                <button
                  title="Delete Item"
                  className="p-2.5 bg-white text-red-500 hover:text-red-600 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 outline-none"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Middle Layout Block: Core Text Metadata */}
            <div className="flex flex-col gap-0.5 px-0.5">
              <h4 className="text-[14px] font-semibold text-neutral-800 tracking-tight group-hover:text-neutral-900 transition-colors line-clamp-1">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[15px] font-bold text-neutral-900">
                  {product.price}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {product.discount}
                </span>
              </div>
              <span
                className={`text-[11px] font-medium mt-1 ${product.stock <= 3 ? "text-red-500" : "text-neutral-400"}`}
              >
                {product.stock} items available
              </span>
            </div>

            {/* Bottom Layout Block: Dynamic Micro Analytics Row */}
            <div className="grid grid-cols-3 gap-1 border-t border-neutral-100 pt-3 text-center text-neutral-400">
              <div className="flex flex-col items-center justify-center">
                <Eye size={13} />
                <span className="text-[11px] font-bold text-neutral-700 mt-0.5">
                  {product.views}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Heart size={13} />
                <span className="text-[11px] font-bold text-neutral-700 mt-0.5">
                  {product.likes}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <ShoppingBag size={13} />
                <span className="text-[11px] font-bold text-neutral-700 mt-0.5">
                  {product.orders}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
