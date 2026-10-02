import { z } from "zod";

export const productIdSchema = z
    .uuid("Invalid product id.");

export const categoryIdSchema = z
    .uuid("Invalid category id.");

export const storeIdSchema = z
    .uuid("Invalid store id.");

export const slugSchema = z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid slug format.",
    );

export const skuSchema = z
    .string()
    .trim()
    .min(1)
    .max(100);

export const metadataSchema = z
    .record(z.string(), z.unknown())
    .default({});

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),

    pageSize: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),
});

export const cursorSchema = z.object({
    cursor: z.string().optional(),
});