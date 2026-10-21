/**
 * Shared types for the client order repository: DB row types, the raw joined
 * order shape consumed by the grouping UI, and the order-detail item shape.
 */
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderStatusHistory } from "@needlon/db/db/schema/orders/order-status-history/table";
import { orderShipments } from "@needlon/db/db/schema/orders/order-shipments/table";
import { shipmentOrders } from "@needlon/db/db/schema/delivery/shipping-orders";
import { shipmentTrackingEvents } from "@needlon/db/db/schema/delivery/shipping-tracking-events";
import {
  type CustomerMeasurementRecord,
} from "@needlon/db/db/schema/customization/measurements";


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

export interface OrderTimelineStep {
  title: string;
  date: string;
  details: string[];
  isActive: boolean;
}

/** DB row types inferred from the Drizzle schema. */
export type OrderRecord = typeof orders.$inferSelect;
export type OrderStatusHistoryRecord = typeof orderStatusHistory.$inferSelect;
export type OrderShipmentRecord = typeof orderShipments.$inferSelect;
export type ShipmentOrderRecord = typeof shipmentOrders.$inferSelect;
export type ShipmentTrackingEventRecord = typeof shipmentTrackingEvents.$inferSelect;
export type { CustomerMeasurementRecord };

/**
 * A buyer-facing shipment: the order's real shipment_orders row (the seller
 * fulfilment system of record), its partner's display name, and its tracking
 * events oldest-first. Replaces the legacy order_shipments reads, which no
 * production code ever wrote.
 */
export interface BuyerOrderShipment {
  shipment: ShipmentOrderRecord;
  partnerName: string;
  trackingEvents: ShipmentTrackingEventRecord[];
}

/** An error carrying an HTTP-style status code, as thrown for ownership / state violations. */
export type StatusCodeError = Error & { statusCode: number };

export function createStatusCodeError(message: string, statusCode: number): StatusCodeError {
  return Object.assign(new Error(message), { statusCode });
}

/** One raw joined order row, as consumed by groupOrderItems. */
export interface RawUserOrder {
  orderId: string;
  orderNumber?: string;
  createdAt: Date | null;
  status: string;
  total: number;
  currency: string | null;
  paymentId: string | null;
  productName: string;
  image: string | null;
  price: number;
  properties: string | null;
  mediaUrls?: string[];
  source?: string;
  tailoringStage?: string | null;
}

export interface OrderShippingAddressSnapshot {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  alternate_phone: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

/** One order-detail entry (one per order item), as consumed by the order views. */
export interface OrderDetailItem {
  orderDate: Date;
  orderId: string;
  rawOrderId: string;
  sellerId: string;
  shippingAddress: OrderShippingAddressSnapshot | null;
  itemName: string;
  image: string;
  productId: string;
  orderItemId: string;
  orderProperties: string;
  paymentMode: string;
  shippingCharge: number;
  podCharge: number;
  priceAtperchage: number;
  totalPurchasePrice: number;
  couponDiscount: number;
  orderStatus: string;
  source: string;
  isClientOrder: boolean;
  isPickup: boolean;
  mediaUrls: string[];
  timeline: OrderTimelineStep[];
  shipments: BuyerOrderShipment[];
  canCancel: boolean;
  hasMeasurement: boolean;
  measurementData: CustomerMeasurementRecord | null;
}
