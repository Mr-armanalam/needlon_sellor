import { z } from "zod";

export const updatePricingSchema = z.object({
  retailPrice: z.union([z.string(), z.number()]).transform((val) => String(val)),
  discountOfferRate: z.union([z.string(), z.number()]).transform((val) => String(val)).optional(),
  currencyCode: z.string().trim().max(10).default("INR"),
  compareAtPrice: z.union([z.string(), z.number()]).transform((val) => String(val)).optional().nullable(),
  costPrice: z.union([z.string(), z.number()]).transform((val) => String(val)).optional().nullable(),
  minimumAdvertisedPrice: z.union([z.string(), z.number()]).transform((val) => String(val)).optional().nullable(),
  effectiveFrom: z.string().optional().nullable(),
  effectiveUntil: z.string().optional().nullable(),
  isTaxInclusive: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UpdatePricingSchema = z.infer<typeof updatePricingSchema>;
