import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { db } from "@/db";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shipmentTrackingEvents } from "@/db/schema/delivery/shipping-tracking-events";
import { and, asc, eq } from "drizzle-orm";
import { NotFoundError } from "@/modules/shared/errors/not-found-error";
import { BadRequestError } from "@/modules/shared/errors/bad-request-error";
import { orders } from "@/db/schema/orders/table";
import {
  getShippingPartners,
  getShippingMethodsForPartner,
  getSellerCarrierConnections,
  connectCarrierRepo,
  getDeliverySettingsRepo,
  updateLocalDeliverySettingsRepo,
  updatePickupHubRepo,
  addShippingZoneRepo,
  createShipmentOrder,
  getSellerShipments,
  updateShipmentStatus,
  assignDeliveryExecutiveRepo,
  addOrderDeliveryAddressRepo,
} from "../repository/delivery.repository";
import {
  CreateShipmentOrderDto,
  UpdateShipmentStatusDto,
  ConnectCarrierDto,
  LocalDeliverySettingsDto,
  PickupHubDto,
  ShippingZoneDto,
  AssignDeliveryExecutiveDto,
  AddOrderDeliveryAddressDto,
} from "../dto/delivery.dto";


export async function getShippingPartnersService() {
  const seller = await getCurrentSellerOrThrow();
  const partners = await getShippingPartners();
  const connections = await getSellerCarrierConnections(seller.id);
  const connectionsByPartnerId = new Map(
    connections.map((c) => [c.partnerId, c]),
  );

  // Merge each partner with the seller's connection state: a connected
  // partner reports the CONNECTION's environment and isActive; an
  // unconnected partner reports connected=false and keeps the partner's
  // platform-level isActive for display only.
  const partnersWithMethods = await Promise.all(
    partners.map(async (p) => {
      const methods = await getShippingMethodsForPartner(p.id);
      const connection = connectionsByPartnerId.get(p.id);
      return {
        ...p,
        isActive: connection ? connection.isActive : p.isActive,
        methods,
        connected: connection != null,
        environment: connection ? connection.environment : null,
      };
    })
  );
  return partnersWithMethods;
}

export async function connectCarrierService(dto: ConnectCarrierDto) {
  const seller = await getCurrentSellerOrThrow();
  return connectCarrierRepo(seller.id, dto);
}

export async function getDeliverySettingsService() {
  const seller = await getCurrentSellerOrThrow();
  return getDeliverySettingsRepo(seller.id);
}

export async function updateLocalDeliverySettingsService(dto: LocalDeliverySettingsDto) {
  const seller = await getCurrentSellerOrThrow();
  return updateLocalDeliverySettingsRepo(seller.id, dto);
}

export async function updatePickupHubService(dto: PickupHubDto) {
  const seller = await getCurrentSellerOrThrow();
  return updatePickupHubRepo(seller.id, dto);
}

export async function addShippingZoneService(dto: ShippingZoneDto) {
  const seller = await getCurrentSellerOrThrow();
  return addShippingZoneRepo(seller.id, dto);
}

export async function getSellerShipmentsService(statusFilter?: string) {
  const seller = await getCurrentSellerOrThrow();
  return getSellerShipments(seller.id, statusFilter);
}

export async function createShipmentOrderService(dto: CreateShipmentOrderDto) {
  const seller = await getCurrentSellerOrThrow();
  return createShipmentOrder(seller.id, dto);
}

export async function updateShipmentStatusService(dto: UpdateShipmentStatusDto) {
  const seller = await getCurrentSellerOrThrow();
  return updateShipmentStatus(seller.id, dto);
}

export async function assignDeliveryExecutiveService(orderId: string, dto: AssignDeliveryExecutiveDto) {
  const seller = await getCurrentSellerOrThrow();

  // The route is order-scoped (the seller works from the order detail);
  // assignment itself is shipment-scoped. Resolve the order (by UUID or
  // order number, seller-scoped like the repository lookups elsewhere in
  // this module), then its shipment.
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(
        isUuid ? eq(orders.id, orderId) : eq(orders.orderNumber, orderId),
        eq(orders.sellerId, seller.id),
      ),
    )
    .limit(1);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  const [shipment] = await db
    .select({ id: shipmentOrders.id })
    .from(shipmentOrders)
    .where(
      and(
        eq(shipmentOrders.orderId, order.id),
        eq(shipmentOrders.sellerId, seller.id),
      ),
    )
    .limit(1);

  if (!shipment) {
    throw new BadRequestError(
      "Create a shipment for this order before assigning a delivery executive",
    );
  }

  return assignDeliveryExecutiveRepo(shipment.id, seller.id, dto.executiveId);
}

export async function addOrderDeliveryAddressService(orderId: string, dto: AddOrderDeliveryAddressDto) {
  const seller = await getCurrentSellerOrThrow();
  return addOrderDeliveryAddressRepo(seller.id, orderId, dto);
}

export interface ShipmentTrackingShipmentDto {
  id: string;
  status: string;
  awbNumber: string | null;
  trackingNumber: string | null;
  partnerName: string;
  /** Partner tracking page URL with {awb}/{trackingNumber} substituted; null when the partner has no template or the shipment has no AWB yet. */
  trackingUrl: string | null;
}

export type ShipmentTrackingEventRecord = typeof shipmentTrackingEvents.$inferSelect;

export interface ShipmentTrackingDto {
  shipment: ShipmentTrackingShipmentDto;
  events: ShipmentTrackingEventRecord[];
}

/**
 * Tracking detail for one of the session seller's shipments: the shipment's
 * real partner/AWB identity, a carrier tracking URL built from the partner's
 * trackingUrlTemplate, and the shipment_tracking_events log (oldest first).
 * A shipment belonging to another seller is indistinguishable from a missing
 * one — both are a 404.
 */
export async function getShipmentTrackingService(
  shipmentId: string
): Promise<ShipmentTrackingDto> {
  const seller = await getCurrentSellerOrThrow();

  const [row] = await db
    .select({
      id: shipmentOrders.id,
      status: shipmentOrders.status,
      awbNumber: shipmentOrders.awbNumber,
      trackingNumber: shipmentOrders.trackingNumber,
      partnerName: shippingPartners.partnerName,
      trackingUrlTemplate: shippingPartners.trackingUrlTemplate,
    })
    .from(shipmentOrders)
    .innerJoin(
      shippingPartners,
      eq(shipmentOrders.shippingPartnerId, shippingPartners.id)
    )
    .where(
      and(eq(shipmentOrders.id, shipmentId), eq(shipmentOrders.sellerId, seller.id))
    )
    .limit(1);

  if (!row) {
    throw new NotFoundError("Shipment not found");
  }

  const awb = row.awbNumber ?? row.trackingNumber;
  let trackingUrl: string | null = null;
  if (row.trackingUrlTemplate && awb) {
    trackingUrl = row.trackingUrlTemplate
      .replaceAll("{awb}", awb)
      .replaceAll("{trackingNumber}", row.trackingNumber ?? awb);
  }

  const events = await db
    .select()
    .from(shipmentTrackingEvents)
    .where(eq(shipmentTrackingEvents.shipmentId, shipmentId))
    .orderBy(asc(shipmentTrackingEvents.occurredAt));

  return {
    shipment: {
      id: row.id,
      status: row.status,
      awbNumber: row.awbNumber,
      trackingNumber: row.trackingNumber,
      partnerName: row.partnerName,
      trackingUrl,
    },
    events,
  };
}
