'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ChevronLeft, ArrowRight, Sparkles, Check, 
  Upload, Trash2, MoveLeft, MoveRight, Star, Loader2, Image as ImageIcon, Plus, Tag
} from 'lucide-react';

import {
  getProductClient,
  fetchProductImagesClient,
  uploadProductImageClient,
  deleteProductImageClient,
  reorderProductImagesClient,
  setPrimaryThumbnailClient,
  updateProductBasicInfoClient,
  updateProductPricingClient,
  updateProductVariantsClient,
  updateProductInventoryClient,
  updateProductDeliveryClient,
  updateProductSeoClient,
  publishProductClient,
  fetchCategoriesClient,
} from '../api/product-client';

interface AddProductWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  productId?: string | null;
}

interface MediaItem {
  id: string;
  imageUrl: string;
  fileName: string;
  isPrimary: boolean;
  displayOrder: number;
}

const DEFAULT_FORM_DATA = {
  name: 'Handloom Chikankari Kurti',
  brandLabel: 'House of Needlon',
  category: 'Ethnic Wear',
  subcategory: 'Kurtis',
  descriptionStory: 'Write about the weave type, artisan background, and tailoring elements...',
  retailPrice: '2450',
  discountOfferRate: '10',
  sizesMatrix: 'S, M, L, XL, XXL',
  colorsTrack: 'Ivory White, Indigo Blue',
  fabricMaterial: '100% Chanderi Cotton',
  sleevesStyle: 'Three-Quarter Sleeve',
  fitType: 'Straight Regular Fit',
  occasionFocus: 'Festival, Office Wear',
  genderProfile: 'Women',
  targetAgeGroup: 'Adults (18-45 Years)',
  boutiqueStockCount: '14',
  uniqueSku: `NDLN-ETH-KUR-${Math.floor(100 + Math.random() * 900)}`,
  pickupHubAddress: 'Studio Workshop, Block 4C, Kalyan, Maharashtra',
  packageWeight: '0.35',
  deliveryRadiusRange: 'Nationwide Shipping',
  estimatedDeliveryWindow: '3 - 5 business days delivery timeline',
  searchKeywords: 'handloom, chikankari, festive kurti, cotton apparel',
  customVisibility: 'PUBLIC' as const,
  mediaUrls: [] as string[],
};

// Preset Taxonomy Options
const CATEGORY_SUBCATEGORY_MAP: Record<string, string[]> = {
  'Ethnic Wear': ['Kurtis', 'Salwar Suits', 'Lehengas', 'Ethnic Sets', 'Anarkalis', 'Dupattas'],
  'Western Wear': ['Dresses', 'Tops & Tunics', 'Shirts', 'Jeans & Denim', 'Skirts', 'Trousers'],
  'Dupattas': ['Chanderi Dupattas', 'Silk Dupattas', 'Cotton Dupattas', 'Bandhani Dupattas'],
  'Sarees': ['Banarasi Silk', 'Chanderi Saree', 'Linen Saree', 'Chiffon Saree', 'Organza Saree'],
  'Footwear': ['Juttis', 'Kolhapuris', 'Heels & Sandals', 'Flats'],
  'Accessories': ['Handbags & Clutches', 'Jewelry', 'Scarves & Stoles'],
};

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
const STANDARD_COLORS = ['Ivory White', 'Indigo Blue', 'Midnight Black', 'Crimson Red', 'Emerald Green', 'Pastel Pink', 'Mustard Yellow', 'Beige'];
const STANDARD_FABRICS = ['100% Chanderi Cotton', 'Pure Silk', 'Organza', 'Rayon', 'Georgette', 'Linen Blend', 'Velvet'];
const SLEEVES_OPTIONS = ['Three-Quarter Sleeve', 'Full Sleeve', 'Short Sleeve', 'Sleeveless', 'Cap Sleeve'];
const FIT_OPTIONS = ['Straight Regular Fit', 'Slim Fit', 'Oversized Fit', 'Relaxed Fit', 'A-Line Fit'];
const OCCASION_OPTIONS = ['Festival, Office Wear', 'Casual Daily Wear', 'Wedding Collection', 'Party Wear', 'Formal Office'];
const GENDER_OPTIONS = ['Women', 'Men', 'Unisex', 'Girls', 'Boys'];
const AGE_GROUP_OPTIONS = ['Adults (18-45 Years)', 'Teens (13-17 Years)', 'Kids (2-12 Years)', 'Seniors (45+ Years)'];
const DELIVERY_RADIUS_OPTIONS = ['Nationwide Shipping', 'Statewide Delivery', 'Local City Delivery', 'International Express'];
const DELIVERY_WINDOW_OPTIONS = ['3 - 5 business days delivery timeline', '1 - 2 business days', '5 - 7 business days', 'Same Day Dispatch'];
const VISIBILITY_OPTIONS = ['PUBLIC', 'UNLISTED', 'DRAFT'];

export function AddProductWizard({ onClose, onSuccess, productId }: AddProductWizardProps) {
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
      .then((cats: any[]) => {
        if (Array.isArray(cats) && cats.length > 0) {
          const names = Array.from(new Set([...Object.keys(CATEGORY_SUBCATEGORY_MAP), ...cats.map(c => c.name || c)]));
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

  const wizardSteps = [
    { number: 1, label: "Photos" },
    { number: 2, label: "Basic Info" },
    { number: 3, label: "Pricing" },
    { number: 4, label: "Variants" },
    { number: 5, label: "Inventory" },
    { number: 6, label: "Delivery" },
    { number: 7, label: "SEO & Tags" },
    { number: 8, label: "Publish" },
  ];

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
    if (currentStep < wizardSteps.length) setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* Header Return Navigator */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group outline-none"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to Products Shelf</span>
        </button>

        <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-400 bg-neutral-100/80 px-2.5 py-1 rounded-lg">
          <Sparkles size={12} className="text-neutral-600" />
          <span>Step {currentStep} of 8</span>
        </div>
      </div>

      {/* Stepper Node Progress Tracker */}
      <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-1">
          {wizardSteps.map((step, idx) => (
            <div key={step.number} className="flex items-center gap-2 shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                currentStep >= step.number ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {currentStep > step.number ? <Check size={10} strokeWidth={3} /> : step.number}
              </div>
              <span className={`text-[12px] font-semibold tracking-tight ${
                currentStep === step.number ? 'text-neutral-900' : 'text-neutral-400'
              }`}>
                {step.label}
              </span>
              {idx !== wizardSteps.length - 1 && <span className="text-neutral-200 text-[11px] mx-0.5">/</span>}
            </div>
          ))}
        </div>
        <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentStep - 1) / (wizardSteps.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Active Container Panel Stage Area */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] min-h-[380px] flex flex-col justify-between gap-8">
        
        <div className="w-full">
          {/* STEP 1: UPLOAD PHOTOS & VIDEOS */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Upload Media Assets</h3>
                <p className="text-[13px] text-neutral-400">Add up to 5 clear showcase photos and high-definition video loops of your fabric item.</p>
              </div>

              {/* Hidden File Input */}
              <input 
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Dropzone Upload Button */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group ${
                  isDraggingOver 
                    ? "border-neutral-900 bg-neutral-100/80" 
                    : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/40"
                }`}
              >
                <div className="p-3 rounded-xl bg-white text-neutral-400 group-hover:text-neutral-900 shadow-sm transition-transform group-hover:scale-105">
                  {isUploadingMedia ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <span className="text-[13px] font-semibold text-neutral-800">
                  {isUploadingMedia ? "Uploading media assets..." : isDraggingOver ? "Drop files here to upload" : "Drag files or click to map folder location"}
                </span>
                <span className="text-[11px] text-neutral-400">Supports JPEG, PNG, MP4 (Max 1080p profile)</span>
              </div>

              {/* Uploaded Media Gallery Deck */}
              {mediaAssets.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                  <h4 className="text-[13px] font-bold text-neutral-800 tracking-tight">Uploaded Gallery ({mediaAssets.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mediaAssets.map((asset, idx) => (
                      <div key={asset.id} className="relative group bg-neutral-50 rounded-xl border border-neutral-200/80 overflow-hidden flex flex-col">
                        <div className="relative aspect-square w-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                          <img src={asset.imageUrl} alt={asset.fileName} className="w-full h-full object-cover" />
                          
                          {asset.isPrimary && (
                            <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              <span>Thumbnail</span>
                            </span>
                          )}
                        </div>

                        <div className="p-2 flex items-center justify-between bg-white border-t border-neutral-100">
                          <div className="flex items-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveMedia(idx, 'left')}
                              className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
                              title="Move left"
                            >
                              <MoveLeft size={12} />
                            </button>
                            <button
                              disabled={idx === mediaAssets.length - 1}
                              onClick={() => handleMoveMedia(idx, 'right')}
                              className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
                              title="Move right"
                            >
                              <MoveRight size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {!asset.isPrimary && (
                              <button
                                onClick={() => handleSetThumbnail(asset.id)}
                                className="p-1 text-neutral-400 hover:text-amber-600"
                                title="Set as thumbnail"
                              >
                                <Star size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMedia(asset.id)}
                              className="p-1 text-neutral-400 hover:text-red-600"
                              title="Delete image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: BASIC INFORMATION */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Basic Information</h3>
                <p className="text-[13px] text-neutral-400">Define your custom piece title, detailed taxonomy categories, and target fit profiles.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Handloom Chikankari Kurti" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Brand Label</label>
                  <input 
                    type="text" 
                    placeholder="House of Needlon" 
                    value={formData.brandLabel}
                    onChange={(e) => handleInputChange('brandLabel', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                </div>

                {/* Controlled Hybrid Category Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const defaultSub = CATEGORY_SUBCATEGORY_MAP[newCat]?.[0] || 'Kurtis';
                      setFormData(prev => ({ ...prev, category: newCat, subcategory: defaultSub }));
                    }}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Controlled Hybrid Subcategory Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Subcategory</label>
                  <select 
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {subcategoryOptions.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:col-span-2 gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description Story</label>
                  <textarea 
                    rows={2} 
                    placeholder="Write about the weave type, artisan background, and tailoring elements..." 
                    value={formData.descriptionStory}
                    onChange={(e) => handleInputChange('descriptionStory', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PRICING SYSTEM */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Pricing Valuation</h3>
                <p className="text-[13px] text-neutral-400">Establish base metrics and promotional discount windows.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Retail Price (INR)</label>
                  <input 
                    type="text" 
                    placeholder="₹2,450" 
                    value={formData.retailPrice}
                    onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Discount Offer Rate (%)</label>
                  <input 
                    type="text" 
                    placeholder="10%" 
                    value={formData.discountOfferRate}
                    onChange={(e) => handleInputChange('discountOfferRate', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: VARIANTS MATRIX */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Boutique Sizing & Variants</h3>
                <p className="text-[13px] text-neutral-400">Map out the complete spectrum of available sizes, colors, and specific fit metrics.</p>
              </div>

              {/* Sizes Matrix Interactive Pills */}
              <div className="flex flex-col gap-2 bg-neutral-50/60 p-4 rounded-xl border border-neutral-200/60">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Sizes Matrix (Select All Applicable)</label>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {STANDARD_SIZES.map(s => {
                    const activeList = formData.sizesMatrix.split(',').map(item => item.trim());
                    const isSelected = activeList.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => handleToggleSize(s)}
                        className={`px-3.5 py-1.5 text-[12px] font-bold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-600 border-neutral-200/80 hover:border-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <input 
                  type="text" 
                  placeholder="Or custom sizes (e.g. S, M, L, XL)" 
                  value={formData.sizesMatrix}
                  onChange={(e) => handleInputChange('sizesMatrix', e.target.value)}
                  className="w-full mt-2 p-2.5 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none focus:border-neutral-900" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Colors Track Hybrid */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Colors Track</label>
                  <select
                    value={STANDARD_COLORS.includes(formData.colorsTrack) ? formData.colorsTrack : 'Custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'Custom') handleInputChange('colorsTrack', e.target.value);
                    }}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Custom">Custom Color Code...</option>
                  </select>
                  {!STANDARD_COLORS.includes(formData.colorsTrack) && (
                    <input 
                      type="text"
                      placeholder="Type custom color track..."
                      value={formData.colorsTrack}
                      onChange={(e) => handleInputChange('colorsTrack', e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1"
                    />
                  )}
                </div>

                {/* Fabric Material Hybrid */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fabric Material</label>
                  <select
                    value={STANDARD_FABRICS.includes(formData.fabricMaterial) ? formData.fabricMaterial : 'Custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'Custom') handleInputChange('fabricMaterial', e.target.value);
                    }}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {STANDARD_FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                    <option value="Custom">Custom Fabric Material...</option>
                  </select>
                  {!STANDARD_FABRICS.includes(formData.fabricMaterial) && (
                    <input 
                      type="text"
                      placeholder="Type custom fabric material..."
                      value={formData.fabricMaterial}
                      onChange={(e) => handleInputChange('fabricMaterial', e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1"
                    />
                  )}
                </div>

                {/* Sleeves Style Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sleeves Style</label>
                  <select
                    value={formData.sleevesStyle}
                    onChange={(e) => handleInputChange('sleevesStyle', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {SLEEVES_OPTIONS.map(sl => <option key={sl} value={sl}>{sl}</option>)}
                  </select>
                </div>

                {/* Fit Type Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fit Type</label>
                  <select
                    value={formData.fitType}
                    onChange={(e) => handleInputChange('fitType', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {FIT_OPTIONS.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                  </select>
                </div>

                {/* Occasion Focus Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Occasion Focus</label>
                  <select
                    value={formData.occasionFocus}
                    onChange={(e) => handleInputChange('occasionFocus', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {OCCASION_OPTIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                  </select>
                </div>

                {/* Gender Profile Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Gender Profile</label>
                  <select
                    value={formData.genderProfile}
                    onChange={(e) => handleInputChange('genderProfile', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                {/* Target Age Group Dropdown */}
                <div className="flex flex-col sm:col-span-2 gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Target Age Group</label>
                  <select
                    value={formData.targetAgeGroup}
                    onChange={(e) => handleInputChange('targetAgeGroup', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {AGE_GROUP_OPTIONS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: INVENTORY LEVEL */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Inventory & Allocation</h3>
                <p className="text-[13px] text-neutral-400">Set total stock quantities and register stock keeping unit codes.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Boutique Stock Count</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="14" 
                      value={formData.boutiqueStockCount}
                      onChange={(e) => handleInputChange('boutiqueStockCount', e.target.value)}
                      className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                    />
                  </div>
                  {/* Stock Shortcuts */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-neutral-400 font-medium">Quick preset:</span>
                    {['5', '10', '25', '50'].map(cnt => (
                      <button
                        type="button"
                        key={cnt}
                        onClick={() => handleInputChange('boutiqueStockCount', cnt)}
                        className="px-2 py-0.5 text-[11px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors"
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Unique SKU Reference Code</label>
                    <button
                      type="button"
                      onClick={handleGenerateSKU}
                      className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 underline flex items-center gap-1 outline-none"
                    >
                      <Sparkles size={11} />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="NDLN-ETH-KUR-01" 
                    value={formData.uniqueSku}
                    onChange={(e) => handleInputChange('uniqueSku', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all font-mono" 
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 6: DELIVERY LOGISTICS */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Delivery Logistics Mapping</h3>
                <p className="text-[13px] text-neutral-400">Set up the origin warehouse coordinate details and shipping radius variables.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pickup Hub Address</label>
                  <input 
                    type="text" 
                    placeholder="Studio Workshop, Block 4C, Kalyan, Maharashtra" 
                    value={formData.pickupHubAddress}
                    onChange={(e) => handleInputChange('pickupHubAddress', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Package Weight (kg)</label>
                  <input 
                    type="text" 
                    placeholder="0.35 kg" 
                    value={formData.packageWeight}
                    onChange={(e) => handleInputChange('packageWeight', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                </div>

                {/* Delivery Radius Range Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Radius Range</label>
                  <select
                    value={formData.deliveryRadiusRange}
                    onChange={(e) => handleInputChange('deliveryRadiusRange', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {DELIVERY_RADIUS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Estimated Delivery Window Dropdown */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Delivery Window</label>
                  <select
                    value={formData.estimatedDeliveryWindow}
                    onChange={(e) => handleInputChange('estimatedDeliveryWindow', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    {DELIVERY_WINDOW_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: SEO & TAGS (OPTIONAL) */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">SEO optimization & Search Tags <span className="text-[12px] text-neutral-400 font-normal ml-1">(Optional)</span></h3>
                <p className="text-[13px] text-neutral-400">Add meta text identifier keywords to increase discoverability on Google search indices.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Search Keywords / Tags</label>
                  <input 
                    type="text" 
                    placeholder="e.g. handloom, chikankari, festive kurti, cotton apparel" 
                    value={formData.searchKeywords}
                    onChange={(e) => handleInputChange('searchKeywords', e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" 
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-neutral-400 font-medium">Popular tags:</span>
                    {['handloom', 'chikankari', 'festive wear', 'designer kurti', 'cotton apparel'].map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          const current = formData.searchKeywords ? formData.searchKeywords.split(',').map(t => t.trim()) : [];
                          if (!current.includes(tag)) {
                            handleInputChange('searchKeywords', [...current, tag].join(', '));
                          }
                        }}
                        className="px-2 py-0.5 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Tag size={10} />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Custom Visibility Settings</label>
                  <select
                    value={formData.customVisibility}
                    onChange={(e) => handleInputChange('customVisibility', e.target.value as any)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer font-bold text-neutral-800"
                  >
                    {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v} (Visible on public storefront & search indices)</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: PREVIEW & PUBLISH */}
          {currentStep === 8 && (
            <div className="flex flex-col gap-5 items-center justify-center text-center py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md animate-bounce"><ImageIcon size={22} /></div>
              <div className="flex flex-col gap-1 max-w-sm">
                <h3 className="text-[16px] font-bold text-neutral-900">Your Shelf Item Looks Perfect!</h3>
                <p className="text-[13px] text-neutral-400">Everything is complete. Choose to lock it as a silent Draft or Publish it directly to your live public catalog.</p>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Wizard Interactive Action Base Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <button 
            onClick={handleBackStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-4 py-2 text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors outline-none ${
              currentStep === 1 || isSubmitting ? 'text-neutral-300 pointer-events-none' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep === wizardSteps.length && (
              <button 
                disabled={isSubmitting}
                onClick={() => handleSaveProduct('DRAFT')}
                className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-[13px] font-semibold rounded-xl transition-all outline-none"
              >
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </button>
            )}
            
            <button 
              disabled={isSubmitting}
              onClick={currentStep === wizardSteps.length ? () => handleSaveProduct('PUBLISHED') : handleNextStep}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none shadow-sm group"
            >
              <span>{currentStep === wizardSteps.length ? (isSubmitting ? 'Publishing...' : 'Publish Product') : 'Continue'}</span>
              {currentStep === wizardSteps.length ? (
                <Sparkles size={14} />
              ) : (
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
