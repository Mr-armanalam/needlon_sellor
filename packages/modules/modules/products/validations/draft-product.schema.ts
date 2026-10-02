import { z } from "zod";
import {productStatusEnum} from "@/db/schema/catalog/enums";

/**
 * Create Draft
 *
 * Used only when a seller starts the product wizard.
 */
export const createDraftSchema = z.object({
    storeId: z
        .string()
        .uuid(),

    sellerId: z
        .string()
        .uuid(),

    status: z
        .enum(productStatusEnum.enumValues)
        .default("DRAFT"),
});

export type CreateDraftSchema = z.infer<
    typeof createDraftSchema
>;

/**
 * Update Draft Progress
 *
 * Used by every wizard step.
 */
export const updateDraftSchema = z.object({
    currentStep: z
        .number()
        .int()
        .min(1)
        .max(8)
        .optional(),

    completedSteps: z
        .array(
            z.number().int().min(1).max(8),
        )
        .optional(),
});

export type UpdateDraftSchema = z.infer<
    typeof updateDraftSchema
>;

/**
 * Draft Route Parameter
 */
export const draftParamsSchema = z.object({
    id: z
        .string()
        .uuid(),
});

export type DraftParamsSchema = z.infer<
    typeof draftParamsSchema
>;