import { z } from "zod";

import {
    STORE_DESCRIPTION_MAX_LENGTH,
    SHORT_DESCRIPTION_MAX_LENGTH,
    STORE_NAME_MAX_LENGTH,
    STORE_SLUG_MAX_LENGTH,
    SUPPORT_EMAIL_MAX_LENGTH,
    SUPPORT_PHONE_MAX_LENGTH,
    STORE_VISIBILITIES,
} from "../constants";

export const sellerStoreSchema = z.object({
    storeName: z
        .string()
        .trim()
        .min(3)
        .max(STORE_NAME_MAX_LENGTH),

    storeSlug: z
        .string()
        .trim()
        .min(3)
        .max(STORE_SLUG_MAX_LENGTH)
        .regex(/^[a-z0-9-]+$/),

    logoUrl: z
        .string()
        .url()
        .nullable(),

    bannerUrl: z
        .string()
        .url()
        .nullable(),

    shortDescription: z
        .string()
        .trim()
        .max(SHORT_DESCRIPTION_MAX_LENGTH)
        .nullable(),

    description: z
        .string()
        .trim()
        .max(STORE_DESCRIPTION_MAX_LENGTH)
        .nullable(),

    supportEmail: z
        .string()
        .trim()
        .email()
        .max(SUPPORT_EMAIL_MAX_LENGTH)
        .nullable(),

    supportPhone: z
        .string()
        .trim()
        .max(SUPPORT_PHONE_MAX_LENGTH)
        .nullable(),

    visibility: z.enum(STORE_VISIBILITIES),
});