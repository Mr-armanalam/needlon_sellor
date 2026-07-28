import {productStatusEnum} from "@/db/schema/catalog/enums";

/**
 * Creates an empty draft product.
 *
 * Product information is filled gradually
 * through the product wizard.
 */
export interface CreateDraftRequest {
    /**
     * Store that owns this product.
     */
    storeId: string;

    /**
     * Authenticated seller.
     */
    sellerId: string;

    /**
     * Optional initial status.
     * Defaults to DRAFT.
     */
    status?: typeof productStatusEnum.enumValues[number];
}