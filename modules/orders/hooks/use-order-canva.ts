import {useEffect, useState} from "react";
import {fetchOrdersClient} from "@/modules/orders/api/order-client";

const TAB_MAP: Record<string, string> = {
    'New': 'NEW',
    'Accepted': 'ACCEPTED',
    'Packed': 'PACKED',
    'Ready': 'READY',
    'Out for Delivery': 'OUT_FOR_DELIVERY',
    'Completed': 'COMPLETED',
    'Cancelled': 'CANCELLED',
    'Returned': 'RETURNED',
    'Rejected': 'REJECTED',
};

export const useOrderCanva = ()=> {

    const [activeTab, setActiveTab] = useState('New');
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({
        NEW: 0,
        ACCEPTED: 0,
        PACKED: 0,
        READY: 0,
        OUT_FOR_DELIVERY: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        RETURNED: 0,
        REJECTED: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Filter States
    const [deliveryMode, setDeliveryMode] = useState('ALL');
    const [valueTier, setValueTier] = useState('ALL');
    const [dateRange, setDateRange] = useState('ALL');

    useEffect(() => {
        async function loadOrders() {
            setLoading(true);
            setError(null);
            try {
                const apiStatus = TAB_MAP[activeTab] || 'NEW';
                const response = await fetchOrdersClient(apiStatus, searchQuery, {
                    deliveryMode,
                    valueTier,
                    dateRange
                });
                if (response.success && response.data) {
                    setOrders(response.data.items || []);
                    setCounts(response.data.counts || {});
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        }

        const timer = setTimeout(() => {
            loadOrders();
        }, 300); // debounce input

        return () => clearTimeout(timer);
    }, [activeTab, searchQuery, deliveryMode, valueTier, dateRange]);

    // Fulfillment Pipeline statuses
    const orderTabs = [
        { label: 'New', count: counts.NEW || null },
        { label: 'Accepted', count: counts.ACCEPTED || null },
        { label: 'Packed', count: counts.PACKED || null },
        { label: 'Ready', count: counts.READY || null },
        { label: 'Out for Delivery', count: counts.OUT_FOR_DELIVERY || null },
        { label: 'Completed', count: counts.COMPLETED || null },
        { label: 'Cancelled', count: counts.CANCELLED || null },
        { label: 'Returned', count: counts.RETURNED || null },
        { label: 'Rejected', count: counts.REJECTED || null }
    ];

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        orders,
        counts,
        orderTabs,
        loading,
        error,
        deliveryMode,
        dateRange,
        setDateRange,
        setDeliveryMode,
        setValueTier,
        setSearchQuery,
        valueTier,
    }
}