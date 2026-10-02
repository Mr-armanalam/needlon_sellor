import { z } from "zod";

export const createSellerAddressSchema = z.object({
    label: z
        .string()
        .trim()
        .min(1)
        .max(100),

    addressType: z.enum([
        "PICKUP",
        "WAREHOUSE",
        "RETURN",
        "BILLING",
        "REGISTERED_OFFICE",
        "CORPORATE_OFFICE",
        "SHOWROOM",
        "FULFILLMENT_CENTER",
        "DROPSHIP_LOCATION",
    ]),

    contactPerson: z.string().trim().max(150).nullable(),

    contactPhone: z.string().trim().max(20).nullable(),

    companyName: z.string().trim().max(200).nullable(),

    addressLine1: z
        .string()
        .trim()
        .min(5)
        .max(255),

    addressLine2: z
        .string()
        .trim()
        .max(255)
        .nullable(),

    landmark: z
        .string()
        .trim()
        .max(150)
        .nullable(),

    city: z
        .string()
        .trim()
        .min(2)
        .max(120),

    district: z
        .string()
        .trim()
        .max(120)
        .nullable(),

    state: z
        .string()
        .trim()
        .min(2)
        .max(120),

    postalCode: z
        .string()
        .trim()
        .min(3)
        .max(20),

    countryCode: z
        .string()
        .trim()
        .length(2),

    latitude: z.number().nullable(),

    longitude: z.number().nullable(),
    isActive: z.boolean().default(true),

    isDefault: z.boolean(),
});