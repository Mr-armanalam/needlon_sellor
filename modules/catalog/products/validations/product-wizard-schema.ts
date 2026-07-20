import { z } from "zod";

export const productWizardSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brandLabel: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  descriptionStory: z.string().optional(),

  // Pricing
  retailPrice: z.union([z.string(), z.number()]).transform((val) => String(val)),
  discountOfferRate: z.union([z.string(), z.number()]).optional().transform((val) => (val ? String(val) : "0")),

  // Variants Matrix & Boutique Specs
  sizesMatrix: z.string().optional(),
  colorsTrack: z.string().optional(),
  fabricMaterial: z.string().optional(),
  sleevesStyle: z.string().optional(),
  fitType: z.string().optional(),
  occasionFocus: z.string().optional(),
  genderProfile: z.string().optional(),
  targetAgeGroup: z.string().optional(),

  // Inventory
  boutiqueStockCount: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0),
  uniqueSku: z.string().min(1, "SKU reference code is required"),

  // Delivery & Logistics
  pickupHubAddress: z.string().optional(),
  packageWeight: z.string().optional(),
  deliveryRadiusRange: z.string().optional(),
  estimatedDeliveryWindow: z.string().optional(),

  // SEO & Visibility
  searchKeywords: z.string().optional(),
  customVisibility: z.enum(["PUBLIC", "HIDDEN", "PRIVATE"]).default("PUBLIC"),
  status: z.enum(["DRAFT", "INCOMPLETE", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),

  // Media Assets
  mediaUrls: z.array(z.string()).optional(),
});

export type ProductWizardInput = z.infer<typeof productWizardSchema>;
