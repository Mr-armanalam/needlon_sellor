import {
    getOrderDetailsClient,
    updateOrderStatusClient,
    updateTailoringStageClient,
} from "@/modules/orders/api/order-client";
import {useEffect, useState} from "react";
import {PIPELINE_STEPS, STATUS_LABELS} from "@/modules/orders/constants";
import type {OrderDetailResponseDto} from "@/modules/orders/dto";

export const BESPOKE_PIPELINE_STEPS = [
    { key: "ORDER_PLACED", label: "Commission Placed", defaultDesc: "Bespoke commission confirmed with tailor atelier." },
    { key: "MEASUREMENT_VERIFIED", label: "Measurements Verified", defaultDesc: "Measurements verified by Master Cutter." },
    { key: "PATTERN_DRAFTING", label: "Pattern Drafting", defaultDesc: "Individual paper pattern drafted according to body posture." },
    { key: "IN_CUTTING", label: "Precision Cutting", defaultDesc: "Fabric marked & cut by master shears." },
    { key: "TRIAL_FITTING", label: "Trial / Baste Fitting", defaultDesc: "Baste garment prepared for fitting review." },
    { key: "FINAL_STITCH", label: "Hand-Stitching & Assembly", defaultDesc: "Final stitching, buttonholes, and lining assembly." },
    { key: "QUALITY_INSPECTION", label: "Quality Inspection", defaultDesc: "Master tailor final inspection & steam pressing." },
    { key: "READY_FOR_PICKUP", label: "Ready for Pickup", defaultDesc: "Garment packaged and ready at atelier counter." },
    { key: "COMPLETED", label: "Delivered & Complete", defaultDesc: "Bespoke garment handed over to customer." },
];

export const useOrderInspector = (orderId: string) => {
    const [data, setData] = useState<OrderDetailResponseDto | null>(null);
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
        } catch (err: unknown) {
            setError(err instanceof Error && err.message ? err.message : "Failed to fetch details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDetails();
    }, [orderId]);

    const isBespoke = Boolean(data?.tailoringStage || data?.source === "IN_STORE");

    async function handleAdvance() {
        setActionLoading(true);
        try {
            if (isBespoke) {
                const currentStage = data?.tailoringStage || "ORDER_PLACED";
                const currentIdx = BESPOKE_PIPELINE_STEPS.findIndex((s) => s.key === currentStage);
                const effectiveIdx = currentIdx >= 0 ? currentIdx : 0;

                if (effectiveIdx < BESPOKE_PIPELINE_STEPS.length - 1) {
                    const nextStep = BESPOKE_PIPELINE_STEPS[effectiveIdx + 1];
                    await updateTailoringStageClient(
                        orderId,
                        nextStep.key,
                        `Bespoke tailoring milestone advanced to ${nextStep.label}`
                    );
                    await loadDetails();
                }
            } else {
                await updateOrderStatusClient(orderId, "ADVANCE", "Advanced step pipeline via seller portal");
                await loadDetails();
            }
        } catch (err: unknown) {
            alert(err instanceof Error && err.message ? err.message : "Failed to advance order");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCancel() {
        const reason = prompt("Enter cancellation reason (optional):", "Order cancelled by seller");
        if (reason === null) return;
        setActionLoading(true);
        try {
            await updateOrderStatusClient(orderId, "CANCEL", reason.trim() || "Order cancelled by seller");
            await loadDetails();
        } catch (err: unknown) {
            alert(err instanceof Error && err.message ? err.message : "Failed to cancel order");
        } finally {
            setActionLoading(false);
        }
    }

    const { items = [], addresses = [], history = [] } = data || {};
    const deliveryAddress = addresses.find((a) => a.addressType === "DELIVERY") || addresses[0];

    // Pipeline Step Tracking calculation
    const currentStatus = data?.status ?? "";
    let currentStepIdx = 0;
    let stepsTimeline: Array<{ label: string; time: string; description: string }> = [];

    if (isBespoke) {
        const currentStage = data?.tailoringStage || "ORDER_PLACED";
        const foundIdx = BESPOKE_PIPELINE_STEPS.findIndex((s) => s.key === currentStage);
        currentStepIdx = foundIdx >= 0 ? foundIdx : 0;

        stepsTimeline = BESPOKE_PIPELINE_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            const historyItem = history.find((h) =>
                (h.remarks && (
                    h.remarks.toLowerCase().includes(step.key.toLowerCase()) ||
                    h.remarks.toLowerCase().includes(step.label.toLowerCase())
                )) ||
                (step.key === "COMPLETED" && (h.toStatus === "COMPLETED" || h.action === "DELIVERED")) ||
                (step.key === "ORDER_PLACED" && (h.toStatus === "CONFIRMED" || h.action === "CREATED"))
            );

            let time = "Pending";
            let description = step.defaultDesc;

            if (historyItem) {
                time = new Date(historyItem.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                if (historyItem.remarks) description = historyItem.remarks;
            } else if (isCompleted && idx === 0) {
                time = new Date(data?.createdAt ?? "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                description = "In-store bespoke commission accepted by master tailor.";
            }

            if (isCurrent && data?.tailoringNotes) {
                description = data.tailoringNotes;
            }

            return {
                label: step.label,
                time,
                description,
            };
        });
    } else {
        currentStepIdx = PIPELINE_STEPS.indexOf(currentStatus);
        if (currentStepIdx === -1) {
            if (currentStatus === "DELIVERED") currentStepIdx = 5;
            else currentStepIdx = 0;
        }

        stepsTimeline = PIPELINE_STEPS.map((stepKey, idx) => {
            const historyItem = history.find((h) => h.toStatus === stepKey);
            const isCompleted = idx <= currentStepIdx;

            let time = "Pending";
            let description = "";

            if (historyItem) {
                time = new Date(historyItem.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                description = historyItem.remarks || "";
            } else if (isCompleted && idx === 0) {
                time = new Date(data?.createdAt ?? "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    }

    const formatCurrency = (val: number | string) => {
        const num = parseFloat(val.toString()) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    const isFinalState = isBespoke
        ? ((data?.tailoringStage === "COMPLETED") || currentStatus === "COMPLETED" || currentStatus === "CANCELLED")
        : (currentStatus === "COMPLETED" || currentStatus === "CANCELLED" || currentStatus === "RETURNED" || currentStatus === "RETURN_REJECTED");

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
        currentStepIdx,
        isBespoke,
        reload: loadDetails,
    };
};
