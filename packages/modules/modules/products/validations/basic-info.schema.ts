import { z } from "zod";

export const updateBasicInfoSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(255),
  brandLabel: z.string().trim().max(255).optional(),
  category: z.string().trim().max(255).optional(),
  subcategory: z.string().trim().max(255).optional(),
  descriptionStory: z.string().trim().optional(),
  slug: z.string().trim().max(255).optional(),
  hsnCode: z.string().trim().max(50).optional(),
  countryOfOrigin: z.string().trim().max(100).optional(),
});

export type UpdateBasicInfoSchema = z.infer<typeof updateBasicInfoSchema>;
