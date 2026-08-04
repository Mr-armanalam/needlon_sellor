import React, {useState, createContext, useContext} from "react";
import {useProducts} from "./use-products";
import {createDraftProductClient} from "../api/product-client";

function useProductUiSetInternal() {
    const [viewMode, setViewMode] = useState<'shelf' | 'wizard'>('shelf');
    const [draftProductId, setDraftProductId] = useState<string | null>(null);
    const [isCreatingDraft, setIsCreatingDraft] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('Category');
    const [size, setSize] = useState('Size');
    const [priceRange, setPriceRange] = useState('Price Range');
    const [stockStatus, setStockStatus] = useState('Stock Status');
    const [sortOrder, setSortOrder] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

    const { products, refetch, removeProduct, duplicateProduct } = useProducts(
        activeTab,
        searchQuery,
        category,
        size,
        priceRange,
        stockStatus,
        sortOrder
    );

    const handleStartWizard = async () => {
        try {
            setIsCreatingDraft(true);
            const res = await createDraftProductClient();
            const newProductId = res?.data?.id || res?.id;
            setDraftProductId(newProductId || null);
            setViewMode('wizard');
        } catch (err) {
            console.error("Failed to initialize draft product API:", err);
            setViewMode('wizard');
        } finally {
            setIsCreatingDraft(false);
        }
    };

    const handleWizardSuccess = async () => {
        setDraftProductId(null);
        await refetch();
        setViewMode('shelf');
    };

    const handleEditProduct = (id: string) => {
        setDraftProductId(id);
        setViewMode('wizard');
    };

    const handleShareProduct = (product: any) => {
        const link = `${window.location.origin}/products/${product.slug}`;
        navigator.clipboard.writeText(link)
            .then(() => alert(`Share link copied: ${link}`))
            .catch((err) => console.error("Could not copy link:", err));
    };

    const handleBulkUploadClick = () => {
        setIsBulkModalOpen(true);
    };

    const handleBulkUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const text = evt.target?.result as string;
                let items = [];
                if (file.name.endsWith(".json")) {
                    items = JSON.parse(text);
                } else {
                    const lines = text.split("\n").filter(l => l.trim() !== "");
                    const headers = lines[0].split(",").map(h => h.trim());
                    for (let i = 1; i < lines.length; i++) {
                        const cols = lines[i].split(",").map(c => c.trim());
                        const row: any = {};
                        headers.forEach((h, idx) => {
                            row[h] = cols[idx] || "";
                        });
                        items.push(row);
                    }
                }

                const { bulkUploadProductsClient } = await import("../api/product-client");
                await bulkUploadProductsClient(items);
                alert(`Successfully imported ${items.length} products!`);
                await refetch();
            } catch (err: any) {
                alert("Failed to parse/upload bulk file: " + err.message);
            }
        };
        reader.readAsText(file);
    };

    return {
        products,
        viewMode,
        setViewMode,
        draftProductId,
        handleStartWizard,
        handleEditProduct,
        handleShareProduct,
        handleBulkUploadFile,
        handleBulkUploadClick,
        handleWizardSuccess,
        isBulkModalOpen,
        isCreatingDraft,
        searchQuery,
        category,
        size,
        priceRange,
        stockStatus,
        sortOrder,
        setSearchQuery,
        setCategory,
        setSize,
        setPriceRange,
        setStockStatus,
        setSortOrder,
        activeTab,
        setActiveTab,
        duplicateProduct,
        removeProduct,
        setIsBulkModalOpen,
        refetch,
    };
}

const ProductUiContext = createContext<ReturnType<typeof useProductUiSetInternal> | null>(null);

export const ProductUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useProductUiSetInternal();
    return React.createElement(ProductUiContext.Provider, { value }, children);
};

export const useProductUiSet = () => {
    const context = useContext(ProductUiContext);
    if (!context) {
        throw new Error("useProductUiSet must be used within a ProductUiProvider");
    }
    return context;
};