import { z } from "zod";

export const createShippingPartnerSchema = z.object({
  partnerCode: z.string().min(1, "Partner code is required"),
  partnerName: z.string().min(1, "Partner name is required"),
  websiteUrl: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  supportsCod: z.boolean().optional().default(false),
  supportsPickup: z.boolean().optional().default(true),
  supportsReturn: z.boolean().optional().default(true),
});

export const createShippingMethodSchema = z.object({
  partnerId: z.string().uuid("Invalid partner ID"),
  methodCode: z.string().min(1),
  methodName: z.string().min(1),
  estimatedMinDays: z.number().int().min(1).default(1),
  estimatedMaxDays: z.number().int().min(1).default(3),
  supportsCod: z.boolean().optional().default(false),
});

export const createShipmentOrderSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  buyerId: z.string().uuid("Invalid buyer ID"),
  shippingPartnerId: z.string().uuid("Invalid shipping partner ID"),
  shippingMethodId: z.string().uuid("Invalid shipping method ID"),
  awbNumber: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingCost: z.number().min(0).default(0),
  codAmount: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export const updateShipmentStatusSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
  status: z.enum([
    "PENDING",
    "READY_FOR_PICKUP",
    "PICKUP_SCHEDULED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "FAILED_DELIVERY",
    "RETURN_INITIATED",
    "RETURNED",
    "CANCELLED",
  ]),
  awbNumber: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const getShipmentsQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
});

export type CreateShippingPartnerDto = z.infer<typeof createShippingPartnerSchema>;
export type CreateShippingMethodDto = z.infer<typeof createShippingMethodSchema>;
export type CreateShipmentOrderDto = z.infer<typeof createShipmentOrderSchema>;
export type UpdateShipmentStatusDto = z.infer<typeof updateShipmentStatusSchema>;
export type GetShipmentsQueryDto = z.infer<typeof getShipmentsQuerySchema>;

export interface ShipmentResponseDto {
  id: string;
  orderId: string;
  shipmentNumber: string;
  awbNumber: string | null;
  trackingNumber: string | null;
  partnerName: string;
  methodName: string;
  status: string;
  shippingCost: string;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}
