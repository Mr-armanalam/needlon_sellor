import React from 'react';
import OrderStages from "@/modules/orders/components/order-stages";
import SearchNFilters from "@/modules/orders/components/search-n-filters";
import {useOrderCanva} from "@/modules/orders/hooks/use-order-canva";

const OrderStagesHorizontalTab = () => {
    const {
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
    } = useOrderCanva();
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