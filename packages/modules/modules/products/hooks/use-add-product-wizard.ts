import { apiFetch } from "@/modules/auth/lib/auth-client";
import React, {useEffect, useRef, useState, createContext, useContext} from "react";
import {CATEGORY_SUBCATEGORY_MAP, DEFAULT_FORM_DATA, wizardSteps} from "@/modules/products/constants";
import {
    deleteProductImageClient,
    fetchBrandsClient,
    fetchCategoriesClient,
    fetchDeliverySettingsClient,
    fetchProductImagesClient,
    fetchShippingPartnersClient,
    getProductClient,
    publishProductClient, reorderProductImagesClient, setPrimaryThumbnailClient, updateProductBasicInfoClient,
    updateProductDeliveryClient,
    updateProductInventoryClient,
    updateProductPricingClient, updateProductSeoClient, updateProductVariantsClient,
    uploadProductImageClient
} from "@/modules/products";
import { generateProductSeoData } from "@/modules/products/lib/seo-generator";
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
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [subcategoriesData, setSubcategoriesData] = useState<any[]>([]);
    const [verifiedBrands, setVerifiedBrands] = useState<any[]>([]);
    const [shippingPartners, setShippingPartners] = useState<any[]>([]);
    const [pickupHubs, setPickupHubs] = useState<any[]>([]);

    // Step 1: Photos & Media State
    const [mediaAssets, setMediaAssets] = useState<MediaItem[]>([]);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategoriesClient()
            .then((res: any) => {
                const cats = res?.categories || res?.data?.categories;
                const subCats = res?.subcategories || res?.data?.subcategories || [];
                const allCats = res?.allCategories || res?.data?.allCategories || [];
                if (Array.isArray(cats) && cats.length > 0) {
                    setCategoriesData(cats);
                    const names = cats.map((c: any) => c.name).filter(Boolean);
                    setAvailableCategories(names);
                }
                if (Array.isArray(subCats)) {
                    setSubcategoriesData(subCats);
                } else if (Array.isArray(allCats)) {
                    setSubcategoriesData(allCats.filter((c: any) => Boolean(c.parentId)));
                }
            })
            .catch(() => {});

        fetchBrandsClient()
            .then((res: any) => {
                const bList = res?.brands || res?.data?.brands;
                if (Array.isArray(bList)) {
                    setVerifiedBrands(bList);
                }
            })
            .catch(() => {});

        fetchShippingPartnersClient()
            .then((res: any) => {
                const pList = res?.partners || res?.data?.partners;
                if (Array.isArray(pList)) {
                    setShippingPartners(pList);
                }
            })
            .catch(() => {});

        fetchDeliverySettingsClient()
            .then((res: any) => {
                const hub = res?.pickupHub || res?.data?.pickupHub;
                if (hub) {
                    setPickupHubs([hub]);
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
            setActiveProductId(productId);
            getProductClient(productId)
                .then((data: any) => {
                    if (data) {
                        setFormData({
                            name: data.name || '',
                            brandLabel: data.brandLabel || '',
                            brandId: data.brandId || '',
                            brandName: data.brandName || '',
                            category: data.category || '',
                            categoryId: data.categoryId || '',
                            subcategory: data.subcategory || '',
                            subcategoryId: data.subcategoryId || '',
                            descriptionStory: data.descriptionStory || '',
                            currencyCode: data.currencyCode || 'INR',
                            retailPrice: data.retailPrice || '',
                            discountOfferRate: data.discountOfferRate || '0',
                            compareAtPrice: data.compareAtPrice || '',
                            costPrice: data.costPrice || '',
                            minimumAdvertisedPrice: data.minimumAdvertisedPrice || '',
                            effectiveFrom: data.effectiveFrom || '',
                            effectiveUntil: data.effectiveUntil || '',
                            isTaxInclusive: data.isTaxInclusive !== false,
                            sizesMatrix: data.sizesMatrix || '',
                            colorsTrack: data.colorsTrack || 'Ivory White',
                            fabricMaterial: data.fabricMaterial || '100% Chanderi Cotton',
                            sleevesStyle: data.sleevesStyle || 'Three-Quarter Sleeve',
                            fitType: data.fitType || 'Straight Regular Fit',
                            occasionFocus: data.occasionFocus || 'Festival, Office Wear',
                            genderProfile: data.genderProfile || 'Women',
                            targetAgeGroup: data.targetAgeGroup || 'Adults (18-45 Years)',
                            boutiqueStockCount: String(data.boutiqueStockCount ?? ''),
                            uniqueSku: data.uniqueSku || '',
                            lowStockThreshold: data.lowStockThreshold || '5',
                            reservedQuantity: String(data.reservedQuantity ?? '0'),
                            allowBackorder: Boolean(data.allowBackorder),
                            lastAdjustedAt: data.lastAdjustedAt || '',
                            barcode: data.barcode || '',
                            position: String(data.position ?? '0'),
                            pickupHubId: data.pickupHubId || '',
                            pickupHubAddress: data.pickupHubAddress || '',
                            shippingPartnerId: data.shippingPartnerId || '',
                            shippingMethodId: data.shippingMethodId || '',
                            deliveryZone: data.deliveryZone || 'DOMESTIC',
                            packageWeight: data.packageWeight || '',
                            deliveryRadiusRange: data.deliveryRadiusRange || 'Nationwide Shipping',
                            estimatedDeliveryWindow: data.estimatedDeliveryWindow || '3 - 5 business days delivery timeline',
                            searchKeywords: data.searchKeywords || '',
                            customVisibility: data.customVisibility || 'PUBLIC',
                            isCustomizable: data.isCustomizable !== false,
                            hasExistingOrders: Boolean((data.orderCount && data.orderCount > 0) || (data.salesCount && data.salesCount > 0)),
                            slug: data.slug || '',
                            metaTitle: data.metaTitle || '',
                            metaDescription: data.metaDescription || '',
                            canonicalUrl: data.canonicalUrl || '',
                            ogTitle: data.ogTitle || '',
                            ogDescription: data.ogDescription || '',
                            ogImage: data.ogImage || null,
                            twitterTitle: data.twitterTitle || '',
                            twitterDescription: data.twitterDescription || '',
                            twitterImage: data.twitterImage || null,
                            mediaUrls: data.mediaUrls || [],
                        });
                    }
                })
                .catch((err: any) => console.error("Failed to load edit product details:", err));
        }
    }, [productId]);

    useEffect(() => {
        // Auto-populate pickup hub address from seller delivery configuration if blank
        apiFetch("/api/seller/delivery/settings")
            .then(res => res.json())
            .then(result => {
                const hub = result?.data?.pickupHub || result?.pickupHub;
                if (hub) {
                    const fullHubAddress = [hub.hubName, hub.address, hub.city, hub.pincode].filter(Boolean).join(", ");
                    if (fullHubAddress) {
                        setFormData(prev => {
                            if (!prev.pickupHubAddress) {
                                return { ...prev, pickupHubAddress: fullHubAddress };
                            }
                            return prev;
                        });
                    }
                }
            })
            .catch(() => {});
    }, []);

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
                    brandId: formData.brandId || undefined,
                    brandName: formData.brandName || undefined,
                    category: formData.category,
                    categoryId: formData.categoryId || undefined,
                    subcategory: formData.subcategory,
                    subcategoryId: formData.subcategoryId || undefined,
                    descriptionStory: formData.descriptionStory,
                    isCustomizable: formData.isCustomizable,
                });
            } catch (err) {
                console.error("Failed to sync basic info step:", err);
            }
        } else if (currentStep === 3 && activeProductId) {
            try {
                await updateProductPricingClient(activeProductId, {
                    retailPrice: formData.retailPrice,
                    discountOfferRate: formData.discountOfferRate,
                    currencyCode: formData.currencyCode,
                    compareAtPrice: formData.compareAtPrice,
                    costPrice: formData.costPrice,
                    minimumAdvertisedPrice: formData.minimumAdvertisedPrice,
                    effectiveFrom: formData.effectiveFrom,
                    effectiveUntil: formData.effectiveUntil,
                    isTaxInclusive: formData.isTaxInclusive,
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
                    lowStockThreshold: formData.lowStockThreshold,
                    reservedQuantity: formData.reservedQuantity,
                    allowBackorder: formData.allowBackorder,
                    barcode: formData.barcode,
                    position: formData.position,
                });
            } catch (err) {
                console.error("Failed to sync inventory step:", err);
            }
        } else if (currentStep === 6 && activeProductId) {
            try {
                await updateProductDeliveryClient(activeProductId, {
                    pickupHubId: formData.pickupHubId,
                    pickupHubAddress: formData.pickupHubAddress,
                    shippingPartnerId: formData.shippingPartnerId,
                    shippingMethodId: formData.shippingMethodId,
                    deliveryZone: formData.deliveryZone,
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
                    slug: formData.slug,
                    metaTitle: formData.metaTitle,
                    metaDescription: formData.metaDescription,
                    canonicalUrl: formData.canonicalUrl,
                    ogTitle: formData.ogTitle,
                    ogDescription: formData.ogDescription,
                    ogImage: formData.ogImage,
                    twitterTitle: formData.twitterTitle,
                    twitterDescription: formData.twitterDescription,
                    twitterImage: formData.twitterImage,
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

    // Price and discount calculations (bidirectional and stable)
    const handlePriceChange = (newPrice: string) => {
        const numPrice = parseFloat(newPrice);
        setFormData(prev => {
            const next = { ...prev, retailPrice: newPrice };
            const rate = parseFloat(prev.discountOfferRate || '0');
            if (!isNaN(numPrice) && numPrice > 0 && !isNaN(rate) && rate > 0 && rate < 100) {
                next.compareAtPrice = (numPrice / (1 - rate / 100)).toFixed(2);
            } else if (!isNaN(numPrice) && numPrice > 0 && (!prev.compareAtPrice || parseFloat(prev.compareAtPrice) < numPrice)) {
                next.compareAtPrice = newPrice;
            }
            return next;
        });
    };

    const handleDiscountChange = (newDiscount: string) => {
        const rate = parseFloat(newDiscount);
        setFormData(prev => {
            const next = { ...prev, discountOfferRate: newDiscount };
            const numPrice = parseFloat(prev.retailPrice || '0');
            if (!isNaN(numPrice) && numPrice > 0 && !isNaN(rate) && rate > 0 && rate < 100) {
                next.compareAtPrice = (numPrice / (1 - rate / 100)).toFixed(2);
            }
            return next;
        });
    };

    const handleComparePriceChange = (newComparePrice: string) => {
        const compare = parseFloat(newComparePrice);
        setFormData(prev => {
            const next = { ...prev, compareAtPrice: newComparePrice };
            const numPrice = parseFloat(prev.retailPrice || '0');
            if (!isNaN(numPrice) && !isNaN(compare) && compare > numPrice && compare > 0) {
                next.discountOfferRate = (((compare - numPrice) / compare) * 100).toFixed(2);
            } else if (compare <= numPrice) {
                next.discountOfferRate = '0';
            }
            return next;
        });
    };

    // Brand and category selection helpers
    const handleSelectCategory = (catId: string, catName: string) => {
        setFormData(prev => ({
            ...prev,
            categoryId: catId,
            category: catName,
            subcategoryId: '',
            subcategory: '',
        }));
    };

    const handleSelectSubcategory = (subId: string, subName: string) => {
        setFormData(prev => ({
            ...prev,
            subcategoryId: subId,
            subcategory: subName,
        }));
    };

    const handleSelectBrand = (bId: string, bName: string) => {
        setFormData(prev => ({
            ...prev,
            brandId: bId,
            brandName: bName,
            brandLabel: bName,
        }));
    };

    // Auto-generate SEO attributes based on active form state
    const handleRegenerateSeo = () => {
        const primaryAsset = mediaAssets.find(m => m.isPrimary) || mediaAssets[0];
        const generated = generateProductSeoData({
            productName: formData.name,
            brandName: formData.brandName || formData.brandLabel,
            categoryName: formData.category,
            descriptionStory: formData.descriptionStory,
            tags: formData.searchKeywords ? formData.searchKeywords.split(',').map(s => s.trim()).filter(Boolean) : [],
            primaryImageUrl: primaryAsset?.imageUrl || null,
            price: formData.retailPrice,
            currencyCode: formData.currencyCode,
        });
        setFormData(prev => ({
            ...prev,
            slug: generated.slug,
            metaTitle: generated.metaTitle,
            metaDescription: generated.metaDescription,
            canonicalUrl: generated.canonicalUrl,
            ogTitle: generated.ogTitle,
            ogDescription: generated.ogDescription,
            twitterTitle: generated.twitterTitle,
            twitterDescription: generated.twitterDescription,
        }));
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
                    brandId: formData.brandId || undefined,
                    brandName: formData.brandName || undefined,
                    category: formData.category,
                    categoryId: formData.categoryId || undefined,
                    subcategory: formData.subcategory,
                    subcategoryId: formData.subcategoryId || undefined,
                    descriptionStory: formData.descriptionStory,
                    isCustomizable: formData.isCustomizable,
                }).catch(() => {});

                await updateProductPricingClient(targetId, {
                    retailPrice: formData.retailPrice,
                    discountOfferRate: formData.discountOfferRate,
                    currencyCode: formData.currencyCode,
                    compareAtPrice: formData.compareAtPrice,
                    costPrice: formData.costPrice,
                    minimumAdvertisedPrice: formData.minimumAdvertisedPrice,
                    effectiveFrom: formData.effectiveFrom,
                    effectiveUntil: formData.effectiveUntil,
                    isTaxInclusive: formData.isTaxInclusive,
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
                    lowStockThreshold: formData.lowStockThreshold,
                    reservedQuantity: formData.reservedQuantity,
                    allowBackorder: formData.allowBackorder,
                    barcode: formData.barcode,
                    position: formData.position,
                }).catch(() => {});

                await updateProductDeliveryClient(targetId, {
                    pickupHubId: formData.pickupHubId,
                    pickupHubAddress: formData.pickupHubAddress,
                    shippingPartnerId: formData.shippingPartnerId,
                    shippingMethodId: formData.shippingMethodId,
                    deliveryZone: formData.deliveryZone,
                    packageWeight: formData.packageWeight,
                    deliveryRadiusRange: formData.deliveryRadiusRange,
                    estimatedDeliveryWindow: formData.estimatedDeliveryWindow,
                }).catch(() => {});

                await updateProductSeoClient(targetId, {
                    searchKeywords: formData.searchKeywords,
                    customVisibility: formData.customVisibility,
                    slug: formData.slug,
                    metaTitle: formData.metaTitle,
                    metaDescription: formData.metaDescription,
                    canonicalUrl: formData.canonicalUrl,
                    ogTitle: formData.ogTitle,
                    ogDescription: formData.ogDescription,
                    ogImage: formData.ogImage,
                    twitterTitle: formData.twitterTitle,
                    twitterDescription: formData.twitterDescription,
                    twitterImage: formData.twitterImage,
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

    // Subcategory options derived from database or fallback map
    const subcategoryOptions = CATEGORY_SUBCATEGORY_MAP[formData.category] || ['Kurtis', 'General'];

    const filteredSubcategories = subcategoriesData.filter((sub: any) => {
        if (formData.categoryId) {
            return sub.parentId === formData.categoryId;
        }
        const found = categoriesData.find(c => c.name?.toLowerCase() === formData.category?.toLowerCase());
        return found ? sub.parentId === found.id : false;
    });

    return {
        subcategoryOptions,
        filteredSubcategories,
        categoriesData,
        subcategoriesData,
        verifiedBrands,
        shippingPartners,
        pickupHubs,
        handleBackStep,
        handleInputChange,
        handlePriceChange,
        handleDiscountChange,
        handleComparePriceChange,
        handleSelectCategory,
        handleSelectSubcategory,
        handleSelectBrand,
        handleRegenerateSeo,
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