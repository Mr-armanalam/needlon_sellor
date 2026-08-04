import React from 'react';
import {ChevronDown, Search, SlidersHorizontal} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DATE_RANGES, DELIVERY_MODES, VALUE_TIERS} from "@/modules/orders/constants";

const SearchNFilters = (
    {
        searchQuery,
        setSearchQuery,
        deliveryMode,
        setDeliveryMode,
        valueTier,
        setValueTier,
        dateRange,
        setDateRange,
    }
) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
            <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 pl-9 pr-4 py-2 bg-white border border-neutral-200/80 rounded-xl text-[12px] font-medium text-neutral-800 outline-none focus:border-neutral-400 transition-all shadow-sm"
                />
            </div>
            <div className="flex items-center flex-row gap-2 flex-wrap relative">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[12px] font-semibold pr-2 border-r border-neutral-200 mr-1 shrink-0">
                    <SlidersHorizontal size={13} />
                    <span>Filters</span>
                </div>

                {/* Delivery Mode Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={`px-3 py-1.5 border text-[12px] rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer outline-none ${
                            deliveryMode !== 'ALL'
                                ? 'bg-neutral-900 text-white border-transparent'
                                : 'bg-white border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                        <span>{deliveryMode === 'ALL' ? 'Delivery Mode' : DELIVERY_MODES.find(m => m.value === deliveryMode)?.label}</span>
                        <ChevronDown size={12} className={deliveryMode !== 'ALL' ? 'text-neutral-300' : 'text-neutral-400'} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44 bg-white border border-neutral-200/80 rounded-xl shadow-lg p-1 z-50">
                        {DELIVERY_MODES.map((mode) => (
                            <DropdownMenuItem
                                key={mode.value}
                                onClick={() => setDeliveryMode(mode.value)}
                                className={`w-full text-left px-3 py-2 text-[12px] font-medium rounded-lg cursor-pointer transition-colors duration-150 outline-none ${
                                    deliveryMode === mode.value
                                        ? 'bg-neutral-900/5 text-neutral-950 font-bold'
                                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950'
                                }`}
                            >
                                {mode.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Value Tier Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={`px-3 py-1.5 border text-[12px] rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer outline-none ${
                            valueTier !== 'ALL'
                                ? 'bg-neutral-900 text-white border-transparent'
                                : 'bg-white border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                        <span>{valueTier === 'ALL' ? 'Value Tier' : VALUE_TIERS.find(t => t.value === valueTier)?.label}</span>
                        <ChevronDown size={12} className={valueTier !== 'ALL' ? 'text-neutral-300' : 'text-neutral-400'} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white border border-neutral-200/80 rounded-xl shadow-lg p-1 z-50">
                        {VALUE_TIERS.map((tier) => (
                            <DropdownMenuItem
                                key={tier.value}
                                onClick={() => setValueTier(tier.value)}
                                className={`w-full text-left px-3 py-2 text-[12px] font-medium rounded-lg cursor-pointer transition-colors duration-150 outline-none ${
                                    valueTier === tier.value
                                        ? 'bg-neutral-900/5 text-neutral-950 font-bold'
                                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950'
                                }`}
                            >
                                {tier.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Range Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={`px-3 py-1.5 border text-[12px] rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer outline-none ${
                            dateRange !== 'ALL'
                                ? 'bg-neutral-900 text-white border-transparent'
                                : 'bg-white border-neutral-200/60 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                        <span>{dateRange === 'ALL' ? 'Date Range' : DATE_RANGES.find(r => r.value === dateRange)?.label}</span>
                        <ChevronDown size={12} className={dateRange !== 'ALL' ? 'text-neutral-300' : 'text-neutral-400'} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44 bg-white border border-neutral-200/80 rounded-xl shadow-lg p-1 z-50">
                        {DATE_RANGES.map((range) => (
                            <DropdownMenuItem
                                key={range.value}
                                onClick={() => setDateRange(range.value)}
                                className={`w-full text-left px-3 py-2 text-[12px] font-medium rounded-lg cursor-pointer transition-colors duration-150 outline-none ${
                                    dateRange === range.value
                                        ? 'bg-neutral-900/5 text-neutral-950 font-bold'
                                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950'
                                }`}
                            >
                                {range.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters Button if any active */}
                {(deliveryMode !== 'ALL' || valueTier !== 'ALL' || dateRange !== 'ALL') && (
                    <button
                        onClick={() => {
                            setDeliveryMode('ALL');
                            setValueTier('ALL');
                            setDateRange('ALL');
                        }}
                        className="px-2.5 py-1 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-950 text-[11px] font-bold rounded-lg transition-all outline-none shrink-0"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>

    );
};

export default SearchNFilters;