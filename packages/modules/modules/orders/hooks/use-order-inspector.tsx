import {getOrderDetailsClient, updateOrderStatusClient} from "@/modules/orders/api/order-client";
import {useEffect, useState} from "react";
import {PIPELINE_STEPS, STATUS_LABELS} from "@/modules/orders/constants";

export const useOrderInspector = (orderId: string) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);


    async function loadDetails() {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrderDetailsClient(orderId);
            if (response.success && response.data) {
                setData(response.data);
            } else {
                setError("Failed to load order details.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDetails();
    }, [orderId]);

    async function handleAdvance() {
        setActionLoading(true);
        try {
            await updateOrderStatusClient(orderId, "ADVANCE");
            await loadDetails();
        } catch (err: any) {
            alert(err.message || "Failed to advance order");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCancel() {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        setActionLoading(true);
        try {
            await updateOrderStatusClient(orderId, "CANCEL");
            await loadDetails();
        } catch (err: any) {
            alert(err.message || "Failed to cancel order");
        } finally {
            setActionLoading(false);
        }
    }

    const { items = [], addresses = [], history = [] } = data || {};
    const deliveryAddress = addresses.find((a: any) => a.addressType === "DELIVERY") || addresses[0];

    // Calculate current pipeline step index
    const currentStatus = data?.status;
    let currentStepIdx = PIPELINE_STEPS.indexOf(currentStatus);
    if (currentStepIdx === -1) {
        if (currentStatus === "DELIVERED") currentStepIdx = 5;
        else currentStepIdx = 0; // fallback
    }

    // Create display timeline steps
    const stepsTimeline = PIPELINE_STEPS.map((stepKey, idx) => {
        // Check if this step has been completed in history
        const historyItem = history.find((h: any) => h.toStatus === stepKey);
        const isCompleted = idx <= currentStepIdx;

        let time = "Pending";
        let description = "";

        if (historyItem) {
            time = new Date(historyItem.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            description = historyItem.remarks || "";
        } else if (isCompleted && idx === 0) {
            time = new Date(data?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            description = "Order placed by buyer.";
        } else {
            if (stepKey === "CONFIRMED") description = "Awaiting boutique acceptance.";
            else if (stepKey === "PROCESSING") description = "Awaiting packaging and label generation.";
            else if (stepKey === "READY_TO_SHIP") description = "Awaiting logistics carrier pickup.";
            else if (stepKey === "OUT_FOR_DELIVERY") description = "Assigned to fulfillment logistics carrier agent.";
            else if (stepKey === "COMPLETED") description = "Secure customer signature delivery pass validation.";
        }

        return {
            label: STATUS_LABELS[stepKey] || stepKey,
            time,
            description,
        };
    });

    const formatCurrency = (val: any) => {
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    const isFinalState = currentStatus === "COMPLETED" || currentStatus === "CANCELLED" || currentStatus === "RETURNED" || currentStatus === "RETURN_REJECTED";
    const buyerFirstName = data?.buyerName ? data.buyerName.trim().split(/\s+/)[0] : "Customer";

    return {
        buyerFirstName,
        isFinalState,
        formatCurrency,
        stepsTimeline,
        deliveryAddress,
        items,
        handleCancel,
        handleAdvance,
        error,
        loading,
        actionLoading,
        data,
        currentStatus,
        currentStepIdx
    }

}