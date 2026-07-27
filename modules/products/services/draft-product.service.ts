import "reflect-metadata";
import { injectable } from "tsyringe";

import type {
    CreateDraftRequest,
} from "../dto/draft/create-draft.request";

import type {
    UpdateDraftRequest,
} from "../dto/draft/update-draft.request";
import {ProductRepository} from "@/modules/products/repositories/repository";
import {ConflictError, NotFoundError} from "@/modules/shared/errors";
import {productStatusEnum} from "@/db/schema/catalog/enums";

// type ProductStatus = typeof productTypeEnum.enumValues[number];


@injectable()
export class DraftProductService {
    constructor(
        private readonly productRepository: ProductRepository,
    ) {}

    /**
     * Creates a new draft product.
     */
    async createDraft(
        input: CreateDraftRequest,
    ) {
        return this.productRepository.createDraft(input);
    }

    /**
     * Updates draft progress.
     */
    async updateDraft(
        id: string,
        input: UpdateDraftRequest,
    ) {
        const draft =
            await this.productRepository.findDraftById(id);

        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        if (draft.status !== productStatusEnum.enumValues[0]) {
            throw new ConflictError(
                "Only draft products can be updated.",
            );
        }

        return this.productRepository.updateDraft(
            id,
            input,
        );
    }

    /**
     * Returns draft product.
     */
    async getDraft(
        id: string,
    ) {
        const draft =
            await this.productRepository.findDraftById(id);

        if (!draft) {
            throw new NotFoundError(
                "Draft product not found.",
            );
        }

        return draft;
    }

    /**
     * Deletes draft.
     */
    async deleteDraft(
        id: string,
    ) {
        const draft =
            await this.productRepository.findDraftById(id);

        if (!draft) {
            throw new NotFoundError(
                "Draft product not found.",
            );
        }

        if (draft.status !== productStatusEnum.enumValues[0]) {
            throw new ConflictError(
                "Only draft products can be deleted.",
            );
        }

        await this.productRepository.deleteDraft(id);
    }

    /**
     * Updates basic information of draft product (Step 2).
     */
    async updateBasicInfo(
        id: string,
        input: any,
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.descriptionStory) updateData.description = input.descriptionStory;
        if (input.slug) updateData.slug = input.slug;

        return Object.keys(updateData).length > 0
            ? this.productRepository.update(id, updateData)
            : draft;
    }

    async updatePricing(
        id: string,
        input: any,
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
        const { pricingTable } = await import("@/db/schema/catalog/products/pricing/table");
        const { db } = await import("@/db");
        const { eq } = await import("drizzle-orm");

        const [variant] = await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, id))
            .limit(1);

        if (variant) {
            const price = input.retailPrice ? String(input.retailPrice) : "0.00";
            const comparePrice = input.discountOfferRate
                ? String(Number(price) * (1 + Number(input.discountOfferRate) / 100))
                : null;

            await db
                .update(productVariantsTable)
                .set({ price, compareAtPrice: comparePrice })
                .where(eq(productVariantsTable.id, variant.id));

            await db
                .update(pricingTable)
                .set({ price, compareAtPrice: comparePrice })
                .where(eq(pricingTable.variantId, variant.id));
        }

        return { ...draft, ...input, metadata: { ...input } };
    }

    async updateVariants(
        id: string,
        input: any,
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
        const { productVariantOptionsTable } = await import("@/db/schema/catalog/products/product-variant-options/table");
        const { categoryAttributes } = await import("@/db/schema/catalog/categories/category_attributes");
        const { categoryAttributeOptions } = await import("@/db/schema/catalog/categories/category_attribute_options");
        const { db } = await import("@/db");
        const { eq, and } = await import("drizzle-orm");

        const [variant] = await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, id))
            .limit(1);

        if (variant) {
            if (input.sizesMatrix) {
                const [sizeAttr] = await db
                    .select()
                    .from(categoryAttributes)
                    .where(and(
                        eq(categoryAttributes.categoryId, draft.categoryId),
                        eq(categoryAttributes.name, "Size")
                    ))
                    .limit(1);

                if (sizeAttr) {
                    const firstSize = input.sizesMatrix.split(",")[0].trim().toLowerCase();
                    const [opt] = await db
                        .select()
                        .from(categoryAttributeOptions)
                        .where(and(
                            eq(categoryAttributeOptions.attributeId, sizeAttr.id),
                            eq(categoryAttributeOptions.value, firstSize)
                        ))
                        .limit(1);

                    if (opt) {
                        await db
                            .insert(productVariantOptionsTable)
                            .values({
                                variantId: variant.id,
                                attributeId: sizeAttr.id,
                                attributeOptionId: opt.id,
                            })
                            .onConflictDoNothing();
                    }
                }
            }

            if (input.colorsTrack) {
                const [colorAttr] = await db
                    .select()
                    .from(categoryAttributes)
                    .where(and(
                        eq(categoryAttributes.categoryId, draft.categoryId),
                        eq(categoryAttributes.name, "Color")
                    ))
                    .limit(1);

                if (colorAttr) {
                    const firstColor = input.colorsTrack.split(",")[0].trim().toLowerCase().replace(" ", "_");
                    const [opt] = await db
                        .select()
                        .from(categoryAttributeOptions)
                        .where(and(
                            eq(categoryAttributeOptions.attributeId, colorAttr.id),
                            eq(categoryAttributeOptions.value, firstColor)
                        ))
                        .limit(1);

                    if (opt) {
                        await db
                            .insert(productVariantOptionsTable)
                            .values({
                                variantId: variant.id,
                                attributeId: colorAttr.id,
                                attributeOptionId: opt.id,
                            })
                            .onConflictDoNothing();
                    }
                }
            }
        }

        return { ...draft, ...input, metadata: { ...input } };
    }

    async updateInventory(
        id: string,
        input: any,
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
        const { inventoryTable } = await import("@/db/schema/catalog/products/inventory/table");
        const { db } = await import("@/db");
        const { eq } = await import("drizzle-orm");

        const [variant] = await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, id))
            .limit(1);

        if (variant) {
            if (input.uniqueSku) {
                await db
                    .update(productVariantsTable)
                    .set({ sku: input.uniqueSku.trim() })
                    .where(eq(productVariantsTable.id, variant.id));
            }

            if (input.boutiqueStockCount !== undefined) {
                await db
                    .update(inventoryTable)
                    .set({ quantity: Number(input.boutiqueStockCount) })
                    .where(eq(inventoryTable.variantId, variant.id));
            }
        }

        return { ...draft, sku: input.uniqueSku, metadata: { ...input } };
    }

    async updateDelivery(
        id: string,
        input: any,
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
        const { shippingTable } = await import("@/db/schema/catalog/products/shipping/table");
        const { db } = await import("@/db");
        const { eq } = await import("drizzle-orm");

        const [variant] = await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, id))
            .limit(1);

        if (variant) {
            const weightVal = input.packageWeight ? String(input.packageWeight) : "0.00";
            const weightG = Math.round(parseFloat(weightVal) * 1000) || 0;

            await db
                .update(productVariantsTable)
                .set({ weightGrams: weightG })
                .where(eq(productVariantsTable.id, variant.id));

            await db
                .update(shippingTable)
                .set({ weight: weightVal })
                .where(eq(shippingTable.variantId, variant.id));
        }

        return { ...draft, ...input, metadata: { ...input } };
    }

    async updateSeo(
        id: string,
        input: any,
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const { productSeoTable } = await import("@/db/schema/catalog/products/product-seo/table");
        const { db } = await import("@/db");
        const { eq } = await import("drizzle-orm");

        if (input.customVisibility) {
            await this.productRepository.update(id, { visibility: input.customVisibility });
        }

        const keywords = input.searchKeywords
            ? input.searchKeywords.split(",").map((k: string) => k.trim())
            : [];

        await db
            .update(productSeoTable)
            .set({ metaKeywords: keywords })
            .where(eq(productSeoTable.productId, id));

        return { ...draft, ...input, metadata: { ...input } };
    }

    /**
     * Finalizes and publishes the product (Step 8).
     */
    async publishProduct(
        id: string,
        input?: { status?: "DRAFT" | "PUBLISHED" },
    ) {
        const draft = await this.productRepository.findById(id);
        if (!draft) {
            throw new NotFoundError("Draft product not found.");
        }

        const newStatus = input?.status || "PUBLISHED";
        return this.productRepository.update(id, {
            status: newStatus as any,
        });
    }
}





