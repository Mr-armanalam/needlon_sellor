import { z } from "zod";

export const sellerProfileSchema =
    z.object({
        displayName: z
            .string()
            .trim()
            .min(2)
            .max(120),

        phoneNumber: z
            .string()
            .trim()
            .max(20)
            .nullable(),

        profileImageUrl: z
            .string()
            .url()
            .nullable(),

        businessName: z
            .string()
            .trim()
            .max(200)
            .nullable(),

        businessType: z
            .enum([
                "INDIVIDUAL",
                "PROPRIETORSHIP",
                "PARTNERSHIP",
                "LLP",
                "PRIVATE_LIMITED",
                "PUBLIC_LIMITED",
                "TRUST",
                "NGO",
                "OTHER",
            ])
            .nullable(),

        supportEmail: z
            .email()
            .nullable(),

        supportPhone: z
            .string()
            .trim()
            .max(20)
            .nullable(),

        websiteUrl: z
            .string()
            .url()
            .nullable(),

        bio: z
            .string()
            .max(1000)
            .nullable(),

        dateOfBirth: z
            .string()
            .nullable(),
    });

export const createSellerProfileSchema =
    sellerProfileSchema;