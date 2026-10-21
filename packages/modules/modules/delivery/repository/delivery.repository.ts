import { db } from "@/db";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@/db/schema/delivery/shipping-method";
import {
  shipmentOrders,
  shipmentStatusEnum,
} from "@/db/schema/delivery/shipping-orders";
import { deliveryExecutives } from "@/db/schema/delivery/delivery-executives";
import { deliveryAssignments } from "@/db/schema/delivery/delivery-assignments";
import {
  sellerDeliverySettings,
  sellerShippingZones,
} from "@/db/schema/delivery/seller-delivery-settings";
import { sellerCarrierConnections } from "@/db/schema/delivery/seller-carrier-connections";
import { shipmentTrackingEvents } from "@/db/schema/delivery/shipping-tracking-events";
import { orders } from "@/db/schema/orders/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import {
  CreateShipmentOrderDto,
  UpdateShipmentStatusDto,
  ConnectCarrierDto,
  ConnectCarrierResultDto,
  LocalDeliverySettingsDto,
  PickupHubDto,
  ShippingZoneDto,
  AddOrderDeliveryAddressDto,
  DeliveryExecutiveDto,
  DeliverySettingsDto,
} from "../dto/delivery.dto";
import {
  encryptCredentials,
  decryptCredentials,
  type CarrierCredentials,
} from "../lib/credentials-crypto";

type TrackingStatus = (typeof shipmentTrackingEvents)["$inferInsert"]["trackingStatus"];

// ---------------------------------------------------------------------------
// Shipping partners & carrier connections
// ---------------------------------------------------------------------------

/**
 * Platform shipping partners, exactly as stored. Partners are platform data:
 * they are seeded by packages/db/scripts/seed-delivery-partners.ts (or later
 * created from the admin surface). Request-handling code NEVER inserts
 * partner or method rows on read — the old runtime auto-seed of "sandbox"
 * partners is gone.
 */
export async function getShippingPartners() {
  return db
    .select()
    .from(shippingPartners)
    .orderBy(shippingPartners.displayOrder);
}

export async function getSellerCarrierConnections(sellerId: string) {
  return db
    .select()
    .from(sellerCarrierConnections)
    .where(eq(sellerCarrierConnections.sellerId, sellerId));
}

/**
 * Connect (or update) the seller's connection to a platform partner.
 * Credentials are stored AES-256-GCM encrypted on the per-seller
 * seller_carrier_connections row — never on the shared shipping_partners
 * row, and activation is per-seller: one seller can no longer toggle a
 * carrier off for the whole platform. Blank credential fields keep the
 * previously stored ciphertext.
 */
export async function connectCarrierRepo(
  sellerId: string,
  dto: ConnectCarrierDto,
): Promise<ConnectCarrierResultDto> {
  const [partner] = await db
    .select()
    .from(shippingPartners)
    .where(eq(shippingPartners.id, dto.partnerId))
    .limit(1);

  if (!partner) {
    throw new Error("Shipping partner not found");
  }

  const [existing] = await db
    .select()
    .from(sellerCarrierConnections)
    .where(
      and(
        eq(sellerCarrierConnections.sellerId, sellerId),
        eq(sellerCarrierConnections.partnerId, dto.partnerId),
      ),
    )
    .limit(1);

  const apiKey = dto.apiKey?.trim();
  const apiSecret = dto.apiSecret?.trim();

  let credentialsEncrypted: string | null =
    existing?.credentialsEncrypted ?? null;
  if (apiKey || apiSecret) {
    // Merge over any previously stored credentials so a field left blank
    // keeps its stored value instead of erasing it.
    let stored: CarrierCredentials = {};
    if (existing?.credentialsEncrypted) {
      try {
        stored = decryptCredentials(existing.credentialsEncrypted);
      } catch {
        // Stored ciphertext is unreadable (e.g. key rotation); the seller
        // is supplying fresh credentials, so start from what they sent.
        stored = {};
      }
    }
    const merged: CarrierCredentials = { ...stored };
    if (apiKey) merged.apiKey = apiKey;
    if (apiSecret) merged.apiSecret = apiSecret;
    credentialsEncrypted = encryptCredentials(merged);
  }

  const environment = dto.isSandbox ? "SANDBOX" : "LIVE";

  const [connection] = await db
    .insert(sellerCarrierConnections)
    .values({
      sellerId,
      partnerId: dto.partnerId,
      environment,
      credentialsEncrypted,
      isActive: dto.isActive,
    })
    .onConflictDoUpdate({
      target: [
        sellerCarrierConnections.sellerId,
        sellerCarrierConnections.partnerId,
      ],
      set: {
        environment,
        credentialsEncrypted,
        isActive: dto.isActive,
        updatedAt: new Date(),
      },
    })
    .returning();

  // The response carries connection state only — never secrets or ciphertext.
  return {
    ...partner,
    environment: connection.environment,
    isActive: connection.isActive,
    hasCredentials: connection.credentialsEncrypted != null,
  };
}

export async function getShippingMethodsForPartner(partnerId: string) {
  return db
    .select()
    .from(shippingMethods)
    .where(and(eq(shippingMethods.partnerId, partnerId), eq(shippingMethods.isActive, true)))
    .orderBy(shippingMethods.displayOrder);
}

// ---------------------------------------------------------------------------
// Per-seller delivery settings (seller_delivery_settings + seller_shipping_zones)
// ---------------------------------------------------------------------------

type SellerDeliverySettingsRow = (typeof sellerDeliverySettings)["$inferSelect"];
type SellerShippingZoneRow = (typeof sellerShippingZones)["$inferSelect"];

function toLocalRadiusDto(
  row: SellerDeliverySettingsRow | undefined,
): LocalDeliverySettingsDto {
  return {
    maxRadiusKm: row ? Number(row.maxRadiusKm) : 15,
    baseCharge: row ? Number(row.baseCharge) : 0,
    freeShippingThreshold: row ? Number(row.freeShippingThreshold) : 0,
  };
}

function toPickupHubDto(
  row: SellerDeliverySettingsRow | undefined,
): PickupHubDto {
  return {
    hubName: row?.hubName ?? "",
    address: row?.hubAddress ?? "",
    city: row?.hubCity ?? "",
    pincode: row?.hubPincode ?? "",
    phone: row?.hubPhone ?? "",
    operatingHours: row?.operatingHours ?? undefined,
  };
}

function toShippingZoneDto(row: SellerShippingZoneRow): ShippingZoneDto {
  return {
    zoneName: row.zoneName,
    partnerCode: row.partnerCode ?? "",
    flatRateFee: Number(row.flatRateFee),
    estimatedDays: row.estimatedDays ?? "2-4 days",
  };
}

/**
 * A seller's delivery settings from the DB. A seller with no settings row
 * gets neutral defaults (radius 15 km, zero charges, EMPTY pickup hub, no
 * zones) — never another tenant's data and never hardcoded hub details.
 */
export async function getDeliverySettingsRepo(
  sellerId: string,
): Promise<DeliverySettingsDto> {
  const [row] = await db
    .select()
    .from(sellerDeliverySettings)
    .where(eq(sellerDeliverySettings.sellerId, sellerId))
    .limit(1);

  const zoneRows = await db
    .select()
    .from(sellerShippingZones)
    .where(
      and(
        eq(sellerShippingZones.sellerId, sellerId),
        eq(sellerShippingZones.isActive, true),
      ),
    )
    .orderBy(sellerShippingZones.createdAt);

  return {
    localRadius: toLocalRadiusDto(row),
    pickupHub: toPickupHubDto(row),
    zones: zoneRows.map(toShippingZoneDto),
  };
}

export async function updateLocalDeliverySettingsRepo(
  sellerId: string,
  dto: LocalDeliverySettingsDto,
): Promise<LocalDeliverySettingsDto> {
  const [existing] = await db
    .select()
    .from(sellerDeliverySettings)
    .where(eq(sellerDeliverySettings.sellerId, sellerId))
    .limit(1);

  const values = {
    maxRadiusKm: String(dto.maxRadiusKm),
    baseCharge: String(dto.baseCharge),
    freeShippingThreshold: String(
      dto.freeShippingThreshold ?? (existing ? Number(existing.freeShippingThreshold) : 0),
    ),
  };

  const [saved] = await db
    .insert(sellerDeliverySettings)
    .values({ sellerId, ...values })
    .onConflictDoUpdate({
      target: sellerDeliverySettings.sellerId,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();

  return toLocalRadiusDto(saved);
}

export async function updatePickupHubRepo(
  sellerId: string,
  dto: PickupHubDto,
): Promise<PickupHubDto> {
  const values = {
    hubName: dto.hubName,
    hubAddress: dto.address,
    hubCity: dto.city,
    hubPincode: dto.pincode,
    hubPhone: dto.phone,
    operatingHours: dto.operatingHours ?? null,
  };

  const [saved] = await db
    .insert(sellerDeliverySettings)
    .values({ sellerId, ...values })
    .onConflictDoUpdate({
      target: sellerDeliverySettings.sellerId,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();

  return toPickupHubDto(saved);
}

export async function addShippingZoneRepo(
  sellerId: string,
  dto: ShippingZoneDto,
): Promise<ShippingZoneDto[]> {
  await db.insert(sellerShippingZones).values({
    sellerId,
    zoneName: dto.zoneName,
    partnerCode: dto.partnerCode,
    flatRateFee: String(dto.flatRateFee),
    estimatedDays: dto.estimatedDays,
  });

  const zoneRows = await db
    .select()
    .from(sellerShippingZones)
    .where(
      and(
        eq(sellerShippingZones.sellerId, sellerId),
        eq(sellerShippingZones.isActive, true),
      ),
    )
    .orderBy(sellerShippingZones.createdAt);

  return zoneRows.map(toShippingZoneDto);
}

// ---------------------------------------------------------------------------
// Shipments
// ---------------------------------------------------------------------------

export async function createShipmentOrder(sellerId: string, dto: CreateShipmentOrderDto) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, dto.orderId))
    .limit(1);

  if (!order || order.sellerId !== sellerId) {
    throw new Error("Order not found for this seller");
  }

  const partners = await getShippingPartners();
  const partner = partners.find((p) => p.id === dto.shippingPartnerId) || partners[0];
  if (!partner) {
    throw new Error("No shipping partners are configured");
  }
  const methods = await getShippingMethodsForPartner(partner.id);
  // Prefer an explicitly requested method (when it belongs to the partner);
  // otherwise use the partner's first method. A shipment requires a real
  // shipping method — previously the partner's own id was substituted when
  // no method existed, which always violated the shipping_methods FK.
  const method =
    methods.find((m) => m.id === dto.shippingMethodId) || methods[0];
  if (!method) {
    throw new Error(
      `Shipping partner "${partner.partnerName}" has no shipping methods configured`
    );
  }
  const methodId = method.id;

  // AWB provenance: an AWB is either supplied by the seller (booked with
  // the carrier / returned by the carrier's API) or, for the in-house
  // fleet, derived deterministically from the order number. It is NEVER
  // a fabricated random string presented as a carrier identifier.
  let awbNumber = dto.awbNumber;
  if (!awbNumber) {
    if (partner.integrationType === "INHOUSE") {
      awbNumber = `NDL-${order.orderNumber}`;
    } else {
      throw new Error(
        `Shipping partner "${partner.partnerName}" cannot issue an AWB automatically. ` +
          "Book the shipment with the carrier first (connect the carrier or supply the AWB number) and try again."
      );
    }
  }
  const trackingNumber = dto.trackingNumber ?? awbNumber;

  const [inserted] = await db
    .insert(shipmentOrders)
    .values({
      sellerId,
      orderId: order.id,
      buyerId: dto.buyerId ?? order.buyerId,
      shippingPartnerId: partner.id,
      shippingMethodId: methodId,
      shipmentNumber: `SHP-${order.orderNumber}`,
      awbNumber,
      trackingNumber,
      status: "PENDING",
      shippingCost: dto.shippingCost.toString(),
      codAmount: dto.codAmount.toString(),
      notes: dto.notes,
    })
    .returning();

  return inserted;
}

export async function getSellerShipments(sellerId: string, statusFilter?: string) {
  // Shipments are listed exactly as stored. Nothing is created on read:
  // the old behaviour silently inserted a fabricated shipment row for
  // every seller order that lacked one, so sellers saw "shipments" that
  // were never dispatched.
  const conditions = [eq(shipmentOrders.sellerId, sellerId)];
  if (statusFilter && statusFilter !== "ALL") {
    const status = shipmentStatusEnum.enumValues.find(
      (value) => value === statusFilter
    );
    if (status) {
      conditions.push(eq(shipmentOrders.status, status));
    }
  }

  const rows = await db
    .select({
      id: shipmentOrders.id,
      orderId: shipmentOrders.orderId,
      orderNumber: orders.orderNumber,
      buyerName: orders.buyerName,
      shipmentNumber: shipmentOrders.shipmentNumber,
      awbNumber: shipmentOrders.awbNumber,
      trackingNumber: shipmentOrders.trackingNumber,
      status: shipmentOrders.status,
      shippingCost: shipmentOrders.shippingCost,
      notes: shipmentOrders.notes,
      executiveId: shipmentOrders.executiveId,
      estimatedDeliveryAt: shipmentOrders.estimatedDeliveryAt,
      shippedAt: shipmentOrders.shippedAt,
      deliveredAt: shipmentOrders.deliveredAt,
      partnerName: shippingPartners.partnerName,
      methodName: shippingMethods.methodName,
    })
    .from(shipmentOrders)
    .innerJoin(shippingPartners, eq(shipmentOrders.shippingPartnerId, shippingPartners.id))
    .innerJoin(shippingMethods, eq(shipmentOrders.shippingMethodId, shippingMethods.id))
    .leftJoin(orders, eq(shipmentOrders.orderId, orders.id))
    .where(and(...conditions))
    .orderBy(sql`${shipmentOrders.createdAt} DESC`);

  // Resolve the real delivery-executive rows for shipments that carry the
  // executive FK; older rows fall back to the legacy notes-JSON payload.
  const executiveIds = [
    ...new Set(
      rows
        .map((r) => r.executiveId)
        .filter((id): id is string => id != null),
    ),
  ];
  const executiveRows =
    executiveIds.length > 0
      ? await db
          .select()
          .from(deliveryExecutives)
          .where(inArray(deliveryExecutives.id, executiveIds))
      : [];
  const executivesById = new Map(executiveRows.map((e) => [e.id, e]));

  return rows.map((r) => {
    let executive: DeliveryExecutiveDto | null = null;
    const executiveRow = r.executiveId
      ? executivesById.get(r.executiveId)
      : undefined;
    if (executiveRow) {
      executive = {
        executiveName: executiveRow.name,
        executivePhone: executiveRow.phone,
        vehicleType: executiveRow.vehicleType ?? undefined,
      };
    } else if (r.notes) {
      try {
        executive = JSON.parse(r.notes) as DeliveryExecutiveDto;
      } catch {
        // raw notes string
      }
    }

    return {
      id: r.id,
      orderId: r.orderNumber || r.orderId,
      rawOrderId: r.orderId,
      buyerName: r.buyerName || null,
      shipmentNumber: r.shipmentNumber,
      awbNumber: r.awbNumber,
      trackingNumber: r.trackingNumber,
      partnerName: executive?.courierPartner || executive?.partnerName || r.partnerName,
      methodName: executive?.vehicleType ? `${r.methodName} (${executive.vehicleType})` : r.methodName,
      status: r.status,
      shippingCost: r.shippingCost,
      estimatedDeliveryAt: r.estimatedDeliveryAt ? r.estimatedDeliveryAt.toISOString() : null,
      shippedAt: r.shippedAt ? r.shippedAt.toISOString() : null,
      deliveredAt: r.deliveredAt ? r.deliveredAt.toISOString() : null,
      executive,
    };
  });
}

// Shipment lifecycle status -> buyer-visible tracking event. Every status
// change writes a shipment_tracking_events row so the tracking timeline is
// built from real events instead of a hardcoded modal.
const SHIPMENT_TRACKING_EVENTS: Record<
  UpdateShipmentStatusDto["status"],
  { trackingStatus: TrackingStatus; description: string }
> = {
  PENDING: { trackingStatus: "SHIPMENT_CREATED", description: "Shipment created and pending processing" },
  READY_TO_SHIP: { trackingStatus: "SHIPMENT_CREATED", description: "Shipment is packed and ready to ship" },
  LABEL_GENERATED: { trackingStatus: "SHIPMENT_CREATED", description: "Shipping label generated" },
  MANIFEST_GENERATED: { trackingStatus: "SHIPMENT_CREATED", description: "Shipment added to the carrier manifest" },
  PICKED_UP: { trackingStatus: "PICKED_UP", description: "Shipment picked up by the carrier" },
  IN_TRANSIT: { trackingStatus: "IN_TRANSIT", description: "Shipment is in transit" },
  OUT_FOR_DELIVERY: { trackingStatus: "OUT_FOR_DELIVERY", description: "Shipment is out for delivery" },
  DELIVERED: { trackingStatus: "DELIVERED", description: "Shipment delivered" },
  DELIVERY_FAILED: { trackingStatus: "DELIVERY_ATTEMPTED", description: "Delivery attempt failed" },
  RETURN_TO_ORIGIN: { trackingStatus: "RETURNED_TO_ORIGIN", description: "Shipment is being returned to origin" },
  RETURNED: { trackingStatus: "RETURNED", description: "Shipment returned" },
  CANCELLED: { trackingStatus: "CANCELLED", description: "Shipment cancelled" },
};

export async function updateShipmentStatus(sellerId: string, dto: UpdateShipmentStatusDto) {
  const updatePayload: Partial<(typeof shipmentOrders)["$inferInsert"]> = {
    status: dto.status,
    updatedAt: new Date(),
  };

  if (dto.awbNumber) updatePayload.awbNumber = dto.awbNumber;
  if (dto.trackingNumber) updatePayload.trackingNumber = dto.trackingNumber;
  if (dto.notes) updatePayload.notes = dto.notes;

  if (dto.status === "OUT_FOR_DELIVERY" || dto.status === "IN_TRANSIT" || dto.status === "PICKED_UP") {
    updatePayload.shippedAt = new Date();
  } else if (dto.status === "DELIVERED") {
    updatePayload.deliveredAt = new Date();
  }

  // Ownership-scoped: a seller may only mutate their own shipments. A
  // shipment id that does not exist or belongs to another seller updates
  // zero rows and is reported as not found — never as a fake success.
  const [updated] = await db
    .update(shipmentOrders)
    .set(updatePayload)
    .where(
      and(
        eq(shipmentOrders.id, dto.shipmentId),
        eq(shipmentOrders.sellerId, sellerId),
      ),
    )
    .returning();

  if (!updated) {
    throw new Error("Shipment not found for this seller");
  }

  // Record the lifecycle transition as a tracking event (best-effort, like
  // the order-status sync below: a tracking-write failure must not fail
  // the status change itself, but it is logged).
  const trackingEvent = SHIPMENT_TRACKING_EVENTS[dto.status];
  try {
    await db.insert(shipmentTrackingEvents).values({
      shipmentId: updated.id,
      trackingStatus: trackingEvent.trackingStatus,
      eventCode: dto.status,
      eventDescription: trackingEvent.description,
      occurredAt: new Date(),
    });
  } catch (evtErr) {
    console.warn("Failed to write shipment tracking event:", evtErr);
  }

  // Synchronize master order status in product_orders table
  if (dto.status === "DELIVERED" && updated?.orderId) {
    try {
      await db
        .update(orders)
        .set({
          status: "DELIVERED",
          deliveredAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, updated.orderId));
    } catch (ordErr) {
      console.warn("Failed to sync orders.status to DELIVERED:", ordErr);
    }
  } else if (dto.status === "OUT_FOR_DELIVERY" && updated?.orderId) {
    try {
      await db
        .update(orders)
        .set({
          status: "OUT_FOR_DELIVERY",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, updated.orderId));
    } catch (ordErr) {
      console.warn("Failed to sync orders.status to OUT_FOR_DELIVERY:", ordErr);
    }
  }

  return updated;
}

export async function assignDeliveryExecutiveRepo(
  shipmentId: string,
  sellerId: string,
  executiveId: string,
) {
  // Ownership-scoped: a seller may only assign executives to their own
  // shipments. A shipment id that does not exist or belongs to another
  // seller is reported as not found.
  const [shipment] = await db
    .select()
    .from(shipmentOrders)
    .where(
      and(
        eq(shipmentOrders.id, shipmentId),
        eq(shipmentOrders.sellerId, sellerId),
      ),
    )
    .limit(1);

  if (!shipment) {
    throw new Error("Shipment not found for this seller");
  }

  // The executive must be a real roster row, not soft-deleted, and ACTIVE.
  const [executive] = await db
    .select()
    .from(deliveryExecutives)
    .where(
      and(
        eq(deliveryExecutives.id, executiveId),
        isNull(deliveryExecutives.deletedAt),
      ),
    )
    .limit(1);

  if (!executive) {
    throw new Error("Delivery executive not found");
  }
  if (executive.status !== "ACTIVE") {
    throw new Error(
      `Delivery executive "${executive.name}" is not active (status: ${executive.status}) and cannot be assigned`,
    );
  }

  // Close any open assignment for this shipment as REASSIGNED, insert the
  // new assignment, and denormalise the executive onto the shipment — in
  // one transaction. shipment_orders.notes is left completely untouched:
  // assignment data lives in delivery_assignments now, not in notes JSON.
  return db.transaction(async (tx) => {
    await tx
      .update(deliveryAssignments)
      .set({ status: "REASSIGNED", completedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(deliveryAssignments.shipmentId, shipment.id),
          inArray(deliveryAssignments.status, [
            "ASSIGNED",
            "ACCEPTED",
            "PICKED_UP",
          ]),
        ),
      );

    const [assignment] = await tx
      .insert(deliveryAssignments)
      .values({
        shipmentId: shipment.id,
        orderId: shipment.orderId,
        executiveId: executive.id,
        assignedBy: sellerId,
        status: "ASSIGNED",
      })
      .returning();

    const [updatedShipment] = await tx
      .update(shipmentOrders)
      .set({ executiveId: executive.id, updatedAt: new Date() })
      .where(eq(shipmentOrders.id, shipment.id))
      .returning();

    return { shipment: updatedShipment, assignment };
  });
}

export async function addOrderDeliveryAddressRepo(sellerId: string, orderId: string, dto: AddOrderDeliveryAddressDto) {
  // 1. Verify order belongs to seller
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const lookupCondition = isUuid ? eq(orders.id, orderId) : eq(orders.orderNumber, orderId);

  const [orderRecord] = await db
    .select()
    .from(orders)
    .where(and(lookupCondition, eq(orders.sellerId, sellerId)))
    .limit(1);

  if (!orderRecord) {
    throw new Error("Order not found or does not belong to this seller.");
  }

  const actualOrderId = orderRecord.id;

  // 2. Insert new address into order_addresses
  const [newAddress] = await db
    .insert(orderAddresses)
    .values({
      orderId: actualOrderId,
      addressType: "DELIVERY",
      recipientName: dto.recipientName,
      phoneNumber: dto.phoneNumber,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2 || null,
      landmark: dto.landmark || null,
      city: dto.city,
      district: null,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country || "India",
      deliveryNotes: dto.deliveryNotes || null,
    })
    .returning();

  // 3. Update orders table with shippingMethod = 'STANDARD' (Doorstep fulfillment)
  await db
    .update(orders)
    .set({
      shippingMethod: "STANDARD",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, actualOrderId));

  // 4. Record in status history
  await db.insert(orderStatusHistory).values({
    orderId: actualOrderId,
    sellerId,
    toStatus: orderRecord.status,
    action: "UPDATED",
    source: "SELLER",
    result: "SUCCESS",
    remarks: `Doorstep delivery address recorded for ${dto.recipientName} (${dto.city}, ${dto.state})`,
  });

  return newAddress;
}
