import React from 'react';
import OrderStages from "@/modules/orders/components/order-stages";
import SearchNFilters from "@/modules/orders/components/search-n-filters";

interface OrderStagesHorizontalTabProps {
    orderTabs: any[];
    setActiveTab: (tab: string) => void;
    activeTab: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    deliveryMode: string;
    setDeliveryMode: (mode: string) => void;
    valueTier: string;
    setValueTier: (tier: string) => void;
    dateRange: string;
    setDateRange: (range: string) => void;
}

const OrderStagesHorizontalTab = ({
    orderTabs,
    setActiveTab,
    activeTab,
    searchQuery,
    setSearchQuery,
    deliveryMode,
    setDeliveryMode,
    valueTier,
    setValueTier,
    dateRange,
    setDateRange
}: OrderStagesHorizontalTabProps) => {
    return (
        <div className="flex flex-col gap-4 border-b border-neutral-200/60 pb-2 mt-2">
            <OrderStages
                orderTabs={orderTabs}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
            />
            {/* 3. SEARCH & FILTERS ROW */}
            <SearchNFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                deliveryMode={deliveryMode}
                setDeliveryMode={setDeliveryMode}
                valueTier={valueTier}
                setValueTier={setValueTier}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
        </div>
    );
};

export default OrderStagesHorizontalTab;