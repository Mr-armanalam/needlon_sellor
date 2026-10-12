import { z } from "zod";

export const updateBasicInfoSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(255),
  brandLabel: z.string().trim().max(255).optional(),
  brandId: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : val), z.string().uuid().nullable().optional()),
  brandName: z.string().trim().max(150).optional().nullable(),
  category: z.string().trim().max(255).optional(),
  categoryId: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : val), z.string().uuid().nullable().optional()),
  subcategory: z.string().trim().max(255).optional(),
  subcategoryId: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : val), z.string().uuid().nullable().optional()),
  descriptionStory: z.string().trim().optional(),
  slug: z.string().trim().max(255).optional(),
  isCustomizable: z.boolean().optional(),
  hsnCode: z.string().trim().max(50).optional(),
  countryOfOrigin: z.string().trim().max(100).optional(),
});

export type UpdateBasicInfoSchema = z.infer<typeof updateBasicInfoSchema>;
