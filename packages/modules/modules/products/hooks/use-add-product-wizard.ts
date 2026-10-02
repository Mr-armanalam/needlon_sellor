import React, {useEffect, useRef, useState, createContext, useContext} from "react";
import {CATEGORY_SUBCATEGORY_MAP, DEFAULT_FORM_DATA, wizardSteps} from "@/modules/products/constants";
import {
    deleteProductImageClient,
    fetchCategoriesClient,
    fetchProductImagesClient,
    getProductClient,
    publishProductClient, reorderProductImagesClient, setPrimaryThumbnailClient, updateProductBasicInfoClient,
    updateProductDeliveryClient,
    updateProductInventoryClient,
    updateProductPricingClient, updateProductSeoClient, updateProductVariantsClient,
    uploadProductImageClient
} from "@/modules/products";
import {useProductUiSet} from "@/modules/products/hooks/use-product-ui-set";


interface MediaItem {
    id: string;
    imageUrl: string;
    fileName: string;
    isPrimary: boolean;
    displayOrder: number;
}


function useAddProductWizardInternal() {
    const {draftProductId: productId, handleWizardSuccess:onSuccess} = useProductUiSet()
    const [activeProductId, setActiveProductId] = useState<string | null>(productId || null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [availableCategories, setAvailableCategories] = useState<string[]>(Object.keys(CATEGORY_SUBCATEGORY_MAP));

    // Step 1: Photos & Media State
    const [mediaAssets, setMediaAssets] = useState<MediaItem[]>([]);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategoriesClient()
            .then((res: any) => {
                const cats = res?.categories;
                if (Array.isArray(cats) && cats.length > 0) {
                    const names = cats.map((c: any) => c.name).filter(Boolean);
                    setAvailableCategories(names);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (activeProductId) {
            fetchProductImagesClient(activeProductId)
                .then(res => {
                    const items = res?.data || res || [];
                    if (Array.isArray(items)) {
                        setMediaAssets(items);
                    }
                })
                .catch(err => console.error("Failed to load product media:", err));
        }
    }, [activeProductId]);

    useEffect(() => {
        if (productId) {
            getProductClient(productId)
                .then((data: any) => {
                    if (data) {
                        setFormData({
                            name: data.name || '',
                            brandLabel: data.brandLabel || 'House of Needlon',
                            category: data.category || 'Ethnic Wear',
                            subcategory: data.subcategory || 'Kurtis',
                            descriptionStory: data.descriptionStory || '',
                            retailPrice: data.retailPrice || '0',
                            discountOfferRate: data.discountOfferRate || '0',
                            sizesMatrix: data.sizesMatrix || 'S, M, L, XL, XXL',
                            colorsTrack: data.colorsTrack || 'Ivory White, Indigo Blue',
                            fabricMaterial: data.fabricMaterial || '100% Chanderi Cotton',
                            sleevesStyle: data.sleevesStyle || 'Three-Quarter Sleeve',
                            fitType: data.fitType || 'Straight Regular Fit',
                            occasionFocus: data.occasionFocus || 'Festival, Office Wear',
                            genderProfile: data.genderProfile || 'Women',
                            targetAgeGroup: data.targetAgeGroup || 'Adults (18-45 Years)',
                            boutiqueStockCount: String(data.boutiqueStockCount || '0'),
                            uniqueSku: data.uniqueSku || `NDLN-ETH-KUR-${Math.floor(100 + Math.random() * 900)}`,
                            pickupHubAddress: data.pickupHubAddress || 'Studio Workshop, Block 4C, Kalyan, Maharashtra',
                            packageWeight: data.packageWeight || '0.35',
                            deliveryRadiusRange: data.deliveryRadiusRange || 'Nationwide Shipping',
                            estimatedDeliveryWindow: data.estimatedDeliveryWindow || '3 - 5 business days delivery timeline',
                            searchKeywords: data.searchKeywords || 'handloom, chikankari, festive kurti, cotton apparel',
                            customVisibility: data.customVisibility || 'PUBLIC',
                            mediaUrls: data.mediaUrls || [],
                        });
                    }
                })
                .catch((err: any) => console.error("Failed to load edit product details:", err));
        }
    }, [productId]);

    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const processFiles = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        setIsUploadingMedia(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Convert File to base64 Data URL for persistent storage in DB
                const dataUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                if (activeProductId) {
                    const uploaded = await uploadProductImageClient(activeProductId, {
                        imageUrl: dataUrl,
                        fileName: file.name,
                        mimeType: file.type || "image/jpeg",
                        fileSize: file.size,
                    });
                    const newItem = uploaded?.data || uploaded;
                    setMediaAssets(prev => [...prev, newItem]);
                } else {
                    const newItem: MediaItem = {
                        id: `temp-${Date.now()}-${i}`,
                        imageUrl: dataUrl,
                        fileName: file.name,
                        isPrimary: mediaAssets.length === 0,
                        displayOrder: mediaAssets.length,
                    };
                    setMediaAssets(prev => [...prev, newItem]);
                }
            }
        } catch (err: any) {
            alert(err.message || "Failed to upload image asset");
        } finally {
            setIsUploadingMedia(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDeleteMedia = async (imageId: string) => {
        try {
            if (activeProductId && !imageId.startsWith("temp-")) {
                await deleteProductImageClient(activeProductId, imageId);
            }
            setMediaAssets(prev => prev.filter(item => item.id !== imageId));
        } catch (err: any) {
            alert(err.message || "Failed to delete image");
        }
    };

    const handleSetThumbnail = async (imageId: string) => {
        try {
            if (activeProductId && !imageId.startsWith("temp-")) {
                await setPrimaryThumbnailClient(activeProductId, imageId);
            }
            setMediaAssets(prev => prev.map(item => ({
                ...item,
                isPrimary: item.id === imageId
            })));
        } catch (err: any) {
            alert(err.message || "Failed to set thumbnail");
        }
    };

    const handleMoveMedia = async (index: number, direction: 'left' | 'right') => {
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= mediaAssets.length) return;

        const newAssets = [...mediaAssets];
        const [moved] = newAssets.splice(index, 1);
        newAssets.splice(newIndex, 0, moved);

        const updated = newAssets.map((item, idx) => ({ ...item, displayOrder: idx }));
        setMediaAssets(updated);

        if (activeProductId) {
            const ids = updated.map(item => item.id).filter(id => !id.startsWith("temp-"));
            if (ids.length > 0) {
                try {
                    await reorderProductImagesClient(activeProductId, ids);
                } catch (err) {
                    console.error("Failed to reorder images:", err);
                }
            }
        }
    };


    const handleNextStep = async () => {
        if (currentStep === 1) {
            if (mediaAssets.length === 0) {
                alert("Please upload at least 1 showcase image before continuing.");
                return;
            }
        }
        if (currentStep === 2 && activeProductId) {
            try {
                await updateProductBasicInfoClient(activeProductId, {
                    name: formData.name,
                    brandLabel: formData.brandLabel,
                    category: formData.category,
                    subcategory: formData.subcategory,
                    descriptionStory: formData.descriptionStory,
                });
            } catch (err) {
                console.error("Failed to sync basic info step:", err);
            }
        } else if (currentStep === 3 && activeProductId) {
            try {
                await updateProductPricingClient(activeProductId, {
                    retailPrice: formData.retailPrice,
                    discountOfferRate: formData.discountOfferRate,
                });
            } catch (err) {
                console.error("Failed to sync pricing step:", err);
            }
        } else if (currentStep === 4 && activeProductId) {
            try {
                await updateProductVariantsClient(activeProductId, {
                    sizesMatrix: formData.sizesMatrix,
                    colorsTrack: formData.colorsTrack,
                    fabricMaterial: formData.fabricMaterial,
                    sleevesStyle: formData.sleevesStyle,
                    fitType: formData.fitType,
                    occasionFocus: formData.occasionFocus,
                    genderProfile: formData.genderProfile,
                    targetAgeGroup: formData.targetAgeGroup,
                });
            } catch (err) {
                console.error("Failed to sync variants step:", err);
            }
        } else if (currentStep === 5 && activeProductId) {
            try {
                await updateProductInventoryClient(activeProductId, {
                    boutiqueStockCount: formData.boutiqueStockCount,
                    uniqueSku: formData.uniqueSku,
                });
            } catch (err) {
                console.error("Failed to sync inventory step:", err);
            }
        } else if (currentStep === 6 && activeProductId) {
            try {
                await updateProductDeliveryClient(activeProductId, {
                    pickupHubAddress: formData.pickupHubAddress,
                    packageWeight: formData.packageWeight,
                    deliveryRadiusRange: formData.deliveryRadiusRange,
                    estimatedDeliveryWindow: formData.estimatedDeliveryWindow,
                });
            } catch (err) {
                console.error("Failed to sync delivery step:", err);
            }
        } else if (currentStep === 7 && activeProductId) {
            try {
                await updateProductSeoClient(activeProductId, {
                    searchKeywords: formData.searchKeywords,
                    customVisibility: formData.customVisibility,
                });
            } catch (err) {
                console.error("Failed to sync SEO step:", err);
            }
        }
        setCurrentStep(prev => prev < wizardSteps.length ? prev + 1 : prev);
    };

    const handleBackStep = () => { setCurrentStep(prev => prev > 1 ? prev - 1 : prev); };

    const handleInputChange = (field: keyof typeof DEFAULT_FORM_DATA, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Toggle size pill selection
    const handleToggleSize = (size: string) => {
        const currentSizes = formData.sizesMatrix
            ? formData.sizesMatrix.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        let updated: string[];
        if (currentSizes.includes(size)) {
            updated = currentSizes.filter(s => s !== size);
        } else {
            updated = [...currentSizes, size];
        }
        handleInputChange('sizesMatrix', updated.join(', '));
    };

    // Helper to generate human-readable SKU
    const handleGenerateSKU = () => {
        const catCode = (formData.category || 'PROD').substring(0, 3).toUpperCase();
        const subCode = (formData.subcategory || 'GEN').substring(0, 3).toUpperCase();
        const randNum = Math.floor(100 + Math.random() * 900);
        handleInputChange('uniqueSku', `NDLN-${catCode}-${subCode}-${randNum}`);
    };

    const handleSaveProduct = async (status: 'DRAFT' | 'PUBLISHED') => {
        try {
            setIsSubmitting(true);
            let targetId = activeProductId;

            if (!targetId) {
                const { createDraftProductClient } = await import('../api/product-client');
                const res = await createDraftProductClient();
                targetId = res?.data?.id || res?.id;
            }

            if (targetId) {
                await updateProductBasicInfoClient(targetId, {
                    name: formData.name,
                    brandLabel: formData.brandLabel,
                    category: formData.category,
                    subcategory: formData.subcategory,
                    descriptionStory: formData.descriptionStory,
                }).catch(() => {});

                await updateProductPricingClient(targetId, {
                    retailPrice: formData.retailPrice,
                    discountOfferRate: formData.discountOfferRate,
                }).catch(() => {});

                await updateProductVariantsClient(targetId, {
                    sizesMatrix: formData.sizesMatrix,
                    colorsTrack: formData.colorsTrack,
                    fabricMaterial: formData.fabricMaterial,
                    sleevesStyle: formData.sleevesStyle,
                    fitType: formData.fitType,
                    occasionFocus: formData.occasionFocus,
                    genderProfile: formData.genderProfile,
                    targetAgeGroup: formData.targetAgeGroup,
                }).catch(() => {});

                await updateProductInventoryClient(targetId, {
                    boutiqueStockCount: formData.boutiqueStockCount,
                    uniqueSku: formData.uniqueSku,
                }).catch(() => {});

                await updateProductDeliveryClient(targetId, {
                    pickupHubAddress: formData.pickupHubAddress,
                    packageWeight: formData.packageWeight,
                    deliveryRadiusRange: formData.deliveryRadiusRange,
                    estimatedDeliveryWindow: formData.estimatedDeliveryWindow,
                }).catch(() => {});

                await updateProductSeoClient(targetId, {
                    searchKeywords: formData.searchKeywords,
                    customVisibility: formData.customVisibility,
                }).catch(() => {});

                await publishProductClient(targetId, status);
            }
            onSuccess();
        } catch (err: any) {
            alert(err.message || 'Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const subcategoryOptions = CATEGORY_SUBCATEGORY_MAP[formData.category] || ['Kurtis', 'General'];


    return {
        subcategoryOptions,
        handleBackStep,
        handleInputChange,
        handleToggleSize,
        handleGenerateSKU,
        handleSaveProduct,
        handleNextStep,
        handleMoveMedia,
        handleSetThumbnail,
        handleDeleteMedia,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileUpload,
        isDraggingOver,
        isUploadingMedia,
        availableCategories,
        isSubmitting,
        setActiveProductId,
        currentStep,
        fileInputRef,
        mediaAssets,
        formData,
        setFormData,
    }
}

const AddProductWizardContext = createContext<ReturnType<typeof useAddProductWizardInternal> | null>(null);

export const AddProductWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useAddProductWizardInternal();
    return React.createElement(AddProductWizardContext.Provider, { value }, children);
};

export const useAddProductWizard = () => {
    const context = useContext(AddProductWizardContext);
    if (!context) {
        throw new Error("useAddProductWizard must be used within an AddProductWizardProvider");
    }
    return context;
};