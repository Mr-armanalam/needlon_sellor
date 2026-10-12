import { z } from "zod";

export const updateDeliverySchema = z.object({
  pickupHubId: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : String(val)), z.string().nullable().optional()),
  pickupHubAddress: z.preprocess((val) => (val === "" || val === null || val === undefined ? "" : String(val)), z.string().trim().optional()),
  shippingPartnerId: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : String(val)), z.string().nullable().optional()),
  shippingMethodId: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : String(val)), z.string().nullable().optional()),
  deliveryZone: z.string().trim().optional(),
  packageWeight: z.union([z.string(), z.number()]).transform((val) => String(val)).optional(),
  deliveryRadiusRange: z.string().trim().optional(),
  estimatedDeliveryWindow: z.string().trim().optional(),
});

export type UpdateDeliverySchema = z.infer<typeof updateDeliverySchema>;

