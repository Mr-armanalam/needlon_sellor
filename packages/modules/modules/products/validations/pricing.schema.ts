import { z } from "zod";

export const updatePricingSchema = z.object({
  retailPrice: z.union([z.string(), z.number()]).transform((val) => String(val)),
  discountOfferRate: z.union([z.string(), z.number()]).transform((val) => String(val)).optional(),
});

export type UpdatePricingSchema = z.infer<typeof updatePricingSchema>;
