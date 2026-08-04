import { useState, useEffect } from "react";
import {initial_tab} from "@/modules/orders/types";

export const useDocumentPreview = (
    {
        isOpen,
        orderId,
        initialTab,
        orderNumber
    }:
    {
        isOpen: boolean;
        orderId: string;
        initialTab: initial_tab;
        orderNumber: string;
    }
) => {
    const [activeTab, setActiveTab] = useState<"INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL">(initialTab);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState<number>(100);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setZoom(100);
        }
    }, [isOpen, initialTab]);

    useEffect(() => {
        if (!isOpen || !orderId) return;

        async function fetchDocument() {
            setLoading(true);
            setError(null);
            try {
                let endpoint = `/api/orders/${orderId}/invoice`;
                if (activeTab === "PACKING_SLIP") {
                    endpoint = `/api/orders/${orderId}/packing-slip`;
                } else if (activeTab === "SHIPPING_LABEL") {
                    endpoint = `/api/orders/${orderId}/shipping-label`;
                }

                const res = await fetch(endpoint);
                const data = await res.json();

                if (data.success && data.data?.html) {
                    setHtmlContent(data.data.html);
                } else {
                    setError(data.error?.message || "Failed to load document preview");
                }
            } catch (err: any) {
                setError(err.message || "Failed to connect to server");
            } finally {
                setLoading(false);
            }
        }

        fetchDocument();
    }, [isOpen, orderId, activeTab]);

    if (!isOpen) return null;

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 300);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeTab.toLowerCase()}_${orderNumber || orderId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return {
        handleDownload,
        handlePrint,
        loading,
        error,
        zoom,
        setZoom,
        htmlContent,
        activeTab,
        setActiveTab,
    }

}