import { useState } from "react";

export const useManifest = (ordersList: any[] = []) => {

    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(
        ordersList.map((o) => o.id)
    );
    const [courierName, setCourierName] = useState("Express Courier");
    const [pickupDate, setPickupDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manifestHtml, setManifestHtml] = useState<string | null>(null);
    const [manifestNumber, setManifestNumber] = useState<string>("");

    const toggleSelectAll = () => {
        if (selectedOrderIds.length === ordersList.length) {
            setSelectedOrderIds([]);
        } else {
            setSelectedOrderIds(ordersList.map((o) => o.id));
        }
    };

    const toggleSelectOrder = (id: string) => {
        if (selectedOrderIds.includes(id)) {
            setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
        } else {
            setSelectedOrderIds([...selectedOrderIds, id]);
        }
    };

    const handleGenerateManifest = async () => {
        if (selectedOrderIds.length === 0) {
            alert("Please select at least one order to generate manifest.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/orders/manifest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderIds: selectedOrderIds,
                    courierName,
                    pickupDate,
                }),
            });

            const data = await res.json();
            if (data.success && data.data?.html) {
                setManifestHtml(data.data.html);
                setManifestNumber(data.data.manifest?.manifestNumber || "MNF-2026-000001");
            } else {
                setError(data.error?.message || "Failed to generate manifest.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to generate manifest");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintManifest = () => {
        if (!manifestHtml) return;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(manifestHtml);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 300);
        }
    };

    return {
        ordersList,
        handleGenerateManifest,
        handlePrintManifest,
        toggleSelectAll,
        toggleSelectOrder,
        manifestNumber,
        error,
        loading,
        setCourierName,
        setPickupDate,
        manifestHtml,
        setManifestHtml,
        selectedOrderIds,
        setSelectedOrderIds,
        courierName,
        pickupDate,
    }
}