import React, {Dispatch, SetStateAction} from 'react';
import {ArrowUpDown, Search} from "lucide-react";
import {useProductUiSet} from "@/modules/products/hooks/use-product-ui-set";
import {useQuery} from "@tanstack/react-query";
import {productKeys} from "@/modules/products/keys";
import {fetchCategoriesClient} from "@/modules/products/api/product-client";

const NavTabSearchNFilterBar = () => {

    const {
        searchQuery,
        setSearchQuery,
        category,
        setCategory,
        size,
        setSize,
        priceRange,
        setPriceRange,
        sortOrder,
        stockStatus,
        setStockStatus,
        setSortOrder,
        activeTab,
        setActiveTab,
    } = useProductUiSet()

    const { data: categoriesData } = useQuery({
        queryKey: productKeys.categories(),
        queryFn: fetchCategoriesClient,
    });

    const categoriesList = categoriesData?.categories || [];

    const handleToggleSort = () => {
        if (sortOrder === 'newest') setSortOrder('price_asc');
        else if (sortOrder === 'price_asc') setSortOrder('price_desc');
        else setSortOrder('newest');
    };

    return (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-neutral-200/60 pb-2 mt-2">

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-neutral-100/70 p-1 rounded-xl max-w-max overflow-x-auto no-scrollbar">
                {['All', 'Active', 'Draft', 'Out of Stock', 'Archived'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg whitespace-nowrap transition-all duration-200 outline-none ${
                            activeTab === tab
                                ? 'bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Smart Sub-Utilities Deck */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Live Search Box */}
                <div className="relative w-full sm:w-60">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search catalog..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200/80 rounded-xl text-[12px] font-medium text-neutral-800 outline-none focus:border-neutral-400 transition-all shadow-sm"
                    />
                </div>

                {/* Filtering & Sorting */}
                <div className="flex items-center gap-2">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                    >
                        <option value="Category">Category</option>
                        {categoriesList.map((cat: any) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                    >
                        <option value="Size">Size</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="Free Size">Free Size</option>
                    </select>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                    >
                        <option value="Price Range">Price Range</option>
                        <option value="under_1000">Under ₹1,000</option>
                        <option value="1000_3000">₹1,000 - ₹3,000</option>
                        <option value="above_3000">Above ₹3,000</option>
                    </select>

                    <select
                        value={stockStatus}
                        onChange={(e) => setStockStatus(e.target.value)}
                        className="px-3 py-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-[12px] font-medium rounded-xl transition-all duration-200 outline-none cursor-pointer"
                    >
                        <option value="Stock Status">Stock Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>

                    <button
                        onClick={handleToggleSort}
                        title={`Sort: ${sortOrder === 'price_asc' ? 'Price: Low to High' : sortOrder === 'price_desc' ? 'Price: High to Low' : 'Newest'}`}
                        className={`p-2 bg-white border border-neutral-200/60 text-neutral-500 hover:text-neutral-900 rounded-xl shadow-sm transition-colors 
                    ${sortOrder !== 'newest' ? 'border-neutral-900 text-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10' : ''}
                    `}

                    >
                        <ArrowUpDown size={14} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default NavTabSearchNFilterBar;