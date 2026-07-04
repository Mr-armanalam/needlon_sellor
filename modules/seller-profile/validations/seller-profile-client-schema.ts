import { z } from "zod";

const PHONE_REGEX = /^[6-9]\d{9}$/;

const WEBSITE_REGEX =
    /^https?:\/\/([\w-]+\.)+[\w-]+(\/.*)?$/i;

export const sellerProfileClientSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(2, "Display name is required.")
        .max(120),

    phoneNumber: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine(
            (value) => !value || PHONE_REGEX.test(value),
            {
                message: "Enter a valid mobile number.",
            },
        ),

    profileImageUrl: z
        .string()
        .nullable()
        .optional(),

    businessName: z
        .string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal("")),

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
        .nullable()
        .optional(),

    supportEmail: z
        .email("Invalid email address.")
        .optional()
        .or(z.literal("")),

    supportPhone: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine(
            (value) => !value || PHONE_REGEX.test(value),
            {
                message: "Enter a valid support phone.",
            },
        ),

    websiteUrl: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine(
            (value) =>
                !value ||
                WEBSITE_REGEX.test(value),
            {
                message: "Invalid website URL.",
            },
        ),

    bio: z
        .string()
        .trim()
        .max(1000)
        .optional()
        .or(z.literal("")),

    dateOfBirth: z
        .string()
        .optional()
        .or(z.literal("")),
});