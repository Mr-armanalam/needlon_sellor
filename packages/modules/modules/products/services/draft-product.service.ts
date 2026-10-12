import type { CreateDraftRequest, UpdateDraftRequest } from "../dto";
import {
    createDraftProduct,
    findDraftProductById,
    findProductById,
    deleteProduct,
    updateProduct,
    updateDraftProductBasicInfo,
    updateDraftProductPricing,
    updateDraftProductVariants,
    updateDraftProductInventory,
    updateDraftProductDelivery,
    updateDraftProductSeo,
    type UpdateProductData,
} from "../repository";
import { ConflictError, NotFoundError } from "@/modules/shared/errors";
import { productStatusEnum } from "@/db/schema/catalog/enums";

export interface DraftBasicInfoInput {
  name?: string;
  brandLabel?: string;
  category?: string;
  subcategory?: string;
  descriptionStory?: string;
  slug?: string;
  isCustomizable?: boolean;
}

export interface DraftPricingInput {
  retailPrice?: string;
  discountOfferRate?: string;
  [key: string]: unknown;
}

export interface DraftVariantsInput {
  sizesMatrix?: string;
  colorsTrack?: string;
  fabricMaterial?: string;
  sleevesStyle?: string;
  fitType?: string;
  occasionFocus?: string;
  genderProfile?: string;
  targetAgeGroup?: string;
  [key: string]: unknown;
}

export interface DraftInventoryInput {
  uniqueSku?: string;
  boutiqueStockCount?: number | string;
  lowStockThreshold?: number | string;
  allowBackorder?: boolean;
  barcode?: string;
  [key: string]: unknown;
}

export interface DraftDeliveryInput {
  packageWeight?: string | number;
  pickupHubAddress?: string;
  deliveryRadiusRange?: string;
  estimatedDeliveryWindow?: string;
  [key: string]: unknown;
}

export interface DraftSeoInput {
  customVisibility?: string;
  searchKeywords?: string;
  [key: string]: unknown;
}

/**
 * Creates a new draft product.
 */
export async function createDraftProductService(input: CreateDraftRequest) {
    return createDraftProduct(input);
}

/**
 * Updates draft progress.
 */
export async function updateDraftProductService(id: string, input: UpdateDraftRequest) {
    const draft = await findDraftProductById(id);

    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    if (draft.status !== productStatusEnum.enumValues[0]) {
        throw new ConflictError("Only draft products can be updated.");
    }

    const updateData: Record<string, unknown> = {};
    if (input.currentStep !== undefined) updateData.currentStep = input.currentStep;
    if (input.completedSteps !== undefined) updateData.completedSteps = input.completedSteps;

    return updateProduct(id, updateData as UpdateProductData);
}

/**
 * Returns draft product.
 */
export async function getDraftProductService(id: string) {
    const draft = await findDraftProductById(id);

    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    return draft;
}

/**
 * Deletes draft.
 */
export async function deleteDraftProductService(id: string) {
    const draft = await findDraftProductById(id);

    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    if (draft.status !== productStatusEnum.enumValues[0]) {
        throw new ConflictError("Only draft products can be deleted.");
    }

    await deleteProduct(id);
}

/**
 * Updates basic information of draft product (Step 2).
 */
export async function updateDraftProductBasicInfoService(id: string, input: DraftBasicInfoInput) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    return updateDraftProductBasicInfo(id, input);
}

export async function updateDraftProductPricingService(id: string, input: DraftPricingInput) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductPricing(id, input.retailPrice, input.discountOfferRate);

    return { ...draft, ...input, metadata: { ...input } };
}

export async function updateDraftProductVariantsService(id: string, input: DraftVariantsInput) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductVariants(
        id,
        draft.categoryId,
        input.sizesMatrix,
        input.colorsTrack,
        input
    );

    return { ...draft, ...input, metadata: { ...input } };
}

export async function updateDraftProductInventoryService(id: string, input: DraftInventoryInput) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductInventory(id, input.uniqueSku, input.boutiqueStockCount, {
        lowStockThreshold: input.lowStockThreshold,
        allowBackorder: input.allowBackorder,
        barcode: input.barcode,
    });

    return { ...draft, sku: input.uniqueSku, metadata: { ...input } };
}

export async function updateDraftProductDeliveryService(id: string, input: DraftDeliveryInput) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductDelivery(id, input.packageWeight, {
        pickupHubAddress: input.pickupHubAddress,
        deliveryRadiusRange: input.deliveryRadiusRange,
        estimatedDeliveryWindow: input.estimatedDeliveryWindow,
    });

    return { ...draft, ...input, metadata: { ...input } };
}

export async function updateDraftProductSeoService(id: string, input: DraftSeoInput) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    if (input.customVisibility) {
        await updateProduct(id, { visibility: input.customVisibility as ("PRIVATE" | "PUBLIC" | "UNLISTED") });
    }

    await updateDraftProductSeo(id, input.searchKeywords);

    return { ...draft, ...input, metadata: { ...input } };
}

/**
 * Finalizes and publishes the product (Step 8).
 */
export async function publishDraftProductService(id: string, input?: { status?: "DRAFT" | "PUBLISHED" }) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    const newStatus = input?.status || "PUBLISHED";
    const updateData: any = {
        status: newStatus,
        updatedAt: new Date(),
    };

    if (newStatus === "PUBLISHED") {
        updateData.publishedAt = new Date();
        if (!draft.visibility || draft.visibility === "PRIVATE") {
            updateData.visibility = "PUBLIC";
        }
    }

    return updateProduct(id, updateData);
}

/**
 * Legacy class wrapper for backward compatibility with existing tests
 */
export class DraftProductService {
    async createDraft(input: CreateDraftRequest) {
        return createDraftProductService(input);
    }
    async updateDraft(id: string, input: UpdateDraftRequest) {
        return updateDraftProductService(id, input);
    }
    async getDraft(id: string) {
        return getDraftProductService(id);
    }
    async deleteDraft(id: string) {
        return deleteDraftProductService(id);
    }
    async updateBasicInfo(id: string, input: DraftBasicInfoInput) {
        return updateDraftProductBasicInfoService(id, input);
    }
    async updatePricing(id: string, input: DraftPricingInput) {
        return updateDraftProductPricingService(id, input);
    }
    async updateVariants(id: string, input: DraftVariantsInput) {
        return updateDraftProductVariantsService(id, input);
    }
    async updateInventory(id: string, input: DraftInventoryInput) {
        return updateDraftProductInventoryService(id, input);
    }
    async updateDelivery(id: string, input: DraftDeliveryInput) {
        return updateDraftProductDeliveryService(id, input);
    }
    async updateSeo(id: string, input: DraftSeoInput) {
        return updateDraftProductSeoService(id, input);
    }
    async publishProduct(id: string, input?: { status?: "DRAFT" | "PUBLISHED" }) {
        return publishDraftProductService(id, input);
    }
}