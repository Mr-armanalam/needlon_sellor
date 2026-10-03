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

export const connectCarrierSchema = z.object({
  partnerId: z.string().min(1, "Partner ID is required"),
  partnerCode: z.string().min(1),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  isSandbox: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const localDeliverySettingsSchema = z.object({
  maxRadiusKm: z.number().positive("Radius must be greater than 0"),
  baseCharge: z.number().min(0, "Base charge cannot be negative"),
  freeShippingThreshold: z.number().min(0).optional(),
});

export const pickupHubSchema = z.object({
  hubName: z.string().min(2, "Hub name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(3, "Pincode is required"),
  phone: z.string().min(5, "Phone is required"),
  operatingHours: z.string().optional(),
});

export const shippingZoneSchema = z.object({
  zoneName: z.string().min(2, "Zone name is required"),
  partnerCode: z.string().min(1, "Partner code is required"),
  flatRateFee: z.number().min(0, "Fee cannot be negative"),
  estimatedDays: z.string().default("2-4 days"),
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
  orderId: z.string().min(1, "Invalid order ID"),
  buyerId: z.string().optional(),
  shippingPartnerId: z.string().optional(),
  shippingMethodId: z.string().optional(),
  awbNumber: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingCost: z.number().min(0).default(0),
  codAmount: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export const updateShipmentStatusSchema = z.object({
  shipmentId: z.string().min(1, "Invalid shipment ID"),
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
export type ConnectCarrierDto = z.infer<typeof connectCarrierSchema>;
export type LocalDeliverySettingsDto = z.infer<typeof localDeliverySettingsSchema>;
export type PickupHubDto = z.infer<typeof pickupHubSchema>;
export type ShippingZoneDto = z.infer<typeof shippingZoneSchema>;
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
