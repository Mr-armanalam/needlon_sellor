import { z } from "zod";

export const updateDeliverySchema = z.object({
  pickupHubId: z.string().uuid().optional().nullable(),
  pickupHubAddress: z.string().trim().optional(),
  shippingPartnerId: z.string().uuid().optional().nullable(),
  shippingMethodId: z.string().uuid().optional().nullable(),
  deliveryZone: z.string().trim().optional(),
  packageWeight: z.union([z.string(), z.number()]).transform((val) => String(val)).optional(),
  deliveryRadiusRange: z.string().trim().optional(),
  estimatedDeliveryWindow: z.string().trim().optional(),
});

export type UpdateDeliverySchema = z.infer<typeof updateDeliverySchema>;
