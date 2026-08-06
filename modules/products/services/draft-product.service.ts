import type { CreateDraftRequest, UpdateDraftRequest } from "../dto";
import {
    createDraftProduct,
    findDraftProductById,
    findProductById,
    deleteProduct,
    updateProduct,
    updateDraftProductPricing,
    updateDraftProductVariants,
    updateDraftProductInventory,
    updateDraftProductDelivery,
    updateDraftProductSeo,
} from "../repository";
import { ConflictError, NotFoundError } from "@/modules/shared/errors";
import { productStatusEnum } from "@/db/schema/catalog/enums";

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

    const updateData: any = {};
    if (input.currentStep !== undefined) updateData.currentStep = input.currentStep;
    if (input.completedSteps !== undefined) updateData.completedSteps = input.completedSteps;

    return updateProduct(id, updateData);
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
export async function updateDraftProductBasicInfoService(id: string, input: any) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    const updateData: any = {};
    if (input.name) updateData.name = input.name;
    if (input.descriptionStory) updateData.description = input.descriptionStory;
    if (input.slug) updateData.slug = input.slug;

    return Object.keys(updateData).length > 0
        ? updateProduct(id, updateData)
        : draft;
}

export async function updateDraftProductPricingService(id: string, input: any) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductPricing(id, input.retailPrice, input.discountOfferRate);

    return { ...draft, ...input, metadata: { ...input } };
}

export async function updateDraftProductVariantsService(id: string, input: any) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductVariants(id, draft.categoryId, input.sizesMatrix, input.colorsTrack);

    return { ...draft, ...input, metadata: { ...input } };
}

export async function updateDraftProductInventoryService(id: string, input: any) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductInventory(id, input.uniqueSku, input.boutiqueStockCount);

    return { ...draft, sku: input.uniqueSku, metadata: { ...input } };
}

export async function updateDraftProductDeliveryService(id: string, input: any) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    await updateDraftProductDelivery(id, input.packageWeight);

    return { ...draft, ...input, metadata: { ...input } };
}

export async function updateDraftProductSeoService(id: string, input: any) {
    const draft = await findProductById(id);
    if (!draft) {
        throw new NotFoundError("Draft product not found.");
    }

    if (input.customVisibility) {
        await updateProduct(id, { visibility: input.customVisibility });
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
    return updateProduct(id, {
        status: newStatus as any,
    });
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
    async updateBasicInfo(id: string, input: any) {
        return updateDraftProductBasicInfoService(id, input);
    }
    async updatePricing(id: string, input: any) {
        return updateDraftProductPricingService(id, input);
    }
    async updateVariants(id: string, input: any) {
        return updateDraftProductVariantsService(id, input);
    }
    async updateInventory(id: string, input: any) {
        return updateDraftProductInventoryService(id, input);
    }
    async updateDelivery(id: string, input: any) {
        return updateDraftProductDeliveryService(id, input);
    }
    async updateSeo(id: string, input: any) {
        return updateDraftProductSeoService(id, input);
    }
    async publishProduct(id: string, input?: { status?: "DRAFT" | "PUBLISHED" }) {
        return publishDraftProductService(id, input);
    }
}