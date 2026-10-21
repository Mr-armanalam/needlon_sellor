import { z } from "zod";
import type { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import type { shippingMethods } from "@/db/schema/delivery/shipping-method";
import type { sellerCarrierConnections } from "@/db/schema/delivery/seller-carrier-connections";

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
  id: z.string().optional(),
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
    "READY_TO_SHIP",
    "LABEL_GENERATED",
    "MANIFEST_GENERATED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "DELIVERY_FAILED",
    "RETURN_TO_ORIGIN",
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

/**
 * Assignment is by roster identity only: the seller picks a real
 * delivery_executives row. (The previous free-text name/phone/vehicle
 * payload was stuffed into shipment_orders.notes as JSON — that practice
 * is what delivery_assignments replaces.)
 */
export const assignDeliveryExecutiveSchema = z.object({
  executiveId: z.string().uuid("Invalid delivery executive ID"),
});


export const addOrderDeliveryAddressSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  phoneNumber: z.string().min(5, "Contact phone is required"),
  addressLine1: z.string().min(3, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code / PIN is required"),
  country: z.string().optional().default("India"),
  deliveryNotes: z.string().optional(),
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
export type AssignDeliveryExecutiveDto = z.infer<typeof assignDeliveryExecutiveSchema>;
export type AddOrderDeliveryAddressDto = z.infer<typeof addOrderDeliveryAddressSchema>;

export type ShippingPartnerRecord = (typeof shippingPartners)["$inferSelect"];
export type ShippingMethodRecord = (typeof shippingMethods)["$inferSelect"];
export type CarrierConnectionRecord = (typeof sellerCarrierConnections)["$inferSelect"];

/** Partner row as returned by getShippingPartnersService: the partner, its
 *  methods, and the current seller's connection state. `isActive` reflects
 *  the seller's connection when one exists; otherwise it is the partner's
 *  platform-level flag, for display only. */
export type ShippingPartnerWithMethodsDto = ShippingPartnerRecord & {
  methods: ShippingMethodRecord[];
  connected: boolean;
  environment: CarrierConnectionRecord["environment"] | null;
};

/** Response of connectCarrierService: the partner row plus the seller's
 *  connection state. Never carries credentials or ciphertext. */
export type ConnectCarrierResultDto = ShippingPartnerRecord & {
  environment: CarrierConnectionRecord["environment"];
  hasCredentials: boolean;
};

/** Settings payload as returned by getDeliverySettingsRepo / the settings API. */
export interface DeliverySettingsDto {
  localRadius: LocalDeliverySettingsDto;
  pickupHub: PickupHubDto;
  zones: ShippingZoneDto[];
}

/** Payload accepted by updateDeliverySettings, keyed by the settings type. */
export type UpdateDeliverySettingsDataDto =
  | LocalDeliverySettingsDto
  | PickupHubDto
  | ShippingZoneDto;

/** Partner fields used by the connect-carrier UI (full partner rows and
 *  lightweight fallback entries both satisfy this shape). */
export interface ConnectCarrierPartnerDto {
  id: string;
  partnerCode: string;
  partnerName: string;
  name?: string;
  isActive: boolean;
}

/** Delivery executive display payload for a shipment. Sourced from the
 *  delivery_executives row via `shipment_orders.executiveId` when set;
 *  for legacy rows it is parsed from the JSON that
 *  assignDeliveryExecutiveRepo historically persisted in
 *  `shipment_orders.notes`. */
export interface DeliveryExecutiveDto {
  executiveName: string;
  executivePhone: string;
  vehicleType?: string;
  courierPartner?: string;
  partnerName?: string;
  trackingNumber?: string;
  notes?: string | null;
  assignedAt?: string;
}

export interface ShipmentResponseDto {
  id: string;
  orderId: string;
  rawOrderId?: string | null;
  buyerName?: string | null;
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
  executive?: DeliveryExecutiveDto | null;
}

