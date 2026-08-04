export const DELIVERY_MODES = [
    { label: 'All Modes', value: 'ALL' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Express', value: 'EXPRESS' },
    { label: 'Next Day', value: 'NEXT_DAY' },
    { label: 'Same Day', value: 'SAME_DAY' },
];

export const VALUE_TIERS = [
    { label: 'All Tiers', value: 'ALL' },
    { label: 'Low (< ₹1,000)', value: 'LOW' },
    { label: 'Medium (₹1k - ₹3k)', value: 'MEDIUM' },
    { label: 'High (> ₹3,000)', value: 'HIGH' },
];

export const DATE_RANGES = [
    { label: 'All Time', value: 'ALL' },
    { label: 'Last 24 Hours', value: 'TODAY' },
    { label: 'Last 7 Days', value: 'WEEK' },
    { label: 'Last 30 Days', value: 'MONTH' },
];

export const PIPELINE_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "OUT_FOR_DELIVERY", "COMPLETED"];

export const STATUS_LABELS: Record<string, string> = {
    PENDING: "Order Placed",
    CONFIRMED: "Accepted",
    PROCESSING: "Packed",
    READY_TO_SHIP: "Ready for Shipment",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    RETURN_REQUESTED: "Return Requested",
    RETURN_APPROVED: "Return Approved",
    RETURN_REJECTED: "Return Rejected",
    RETURNED: "Returned",
};