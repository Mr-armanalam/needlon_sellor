import { z } from "zod";

export const productWizardSchema = z.object({
  name: z.string().min(1),
  brandLabel: z.string().optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  descriptionStory: z.string().optional(),
  retailPrice: z.string().min(1),
  discountOfferRate: z.string().optional(),
  sizesMatrix: z.string().optional(),
  colorsTrack: z.string().optional(),
  fabricMaterial: z.string().optional(),
  boutiqueStockCount: z.number().int().nonnegative(),
  uniqueSku: z.string().min(1),
  searchKeywords: z.string().optional(),
  customVisibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  packageWeight: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
});

export type ProductWizardInput = z.infer<typeof productWizardSchema>;
