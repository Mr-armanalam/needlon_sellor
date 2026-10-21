import { db } from "@/db";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { sellerCarrierConnections } from "@/db/schema/delivery/seller-carrier-connections";
import { shipmentTrackingEvents } from "@/db/schema/delivery/shipping-tracking-events";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { seller } from "@/db/schema/seller";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { NotFoundError } from "@/modules/shared/errors/not-found-error";
import { BadRequestError } from "@/modules/shared/errors/bad-request-error";
import {
  decryptCredentials,
  type CarrierCredentials,
} from "../lib/credentials-crypto";
import {
  getDeliverySettingsRepo,
  updateShipmentStatus,
} from "../repository/delivery.repository";
import {
  CarrierError,
  ShiprocketAdapter,
  type CarrierAdapter,
  type CarrierFetch,
  type CreateBookingInput,
  type CreateBookingResult,
} from "../carriers";
import type { UpdateShipmentStatusDto } from "../dto/delivery.dto";

/**
 * Carrier booking service — the bridge between stored shipments and real
 * carrier APIs (see modules/delivery/carriers).
 *
 * Session pattern matches delivery.service.ts: every public function
 * resolves the session seller itself via getCurrentSellerOrThrow() and is
 * ownership-scoped by that seller's id.
 *
 * PROVIDER SHIPMENT ID STORAGE: this phase adds no schema columns, so the
 * provider-side shipment id returned at booking time is persisted in the
 * rawPayload of the shipment's CARRIER_BOOKED tracking event. Label
 * generation re-derives it from that event (getProviderShipmentId). If a
 * dedicated column is added later, only this file needs to change.
 */

type ShipmentRow = (typeof shipmentOrders)["$inferSelect"];
type PartnerRow = (typeof shippingPartners)["$inferSelect"];
type TrackingStatus = (typeof shipmentTrackingEvents)["$inferInsert"]["trackingStatus"];
type ShipmentStatus = UpdateShipmentStatusDto["status"];

export interface CarrierOperationOptions {
  /** Test seam: substitute the adapter's HTTP implementation. */
  fetchImpl?: CarrierFetch;
}

export interface BookShipmentResult {
  shipment: ShipmentRow;
  booking: CreateBookingResult;
}

export interface SyncTrackingResult {
  shipmentId: string;
  /** Carrier's raw current-status text for the shipment. */
  currentStatus: string;
  eventsReceived: number;
  eventsInserted: number;
}

// ---------------------------------------------------------------------------
// Carrier status mapping (raw provider text -> our enums)
// ---------------------------------------------------------------------------

function normalizeCarrierStatus(raw: string): string {
  return raw.toUpperCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Map a raw carrier status string onto our tracking_status enum.
 * Conservative by contract: anything unrecognised becomes IN_TRANSIT
 * (the shipment demonstrably exists and is moving through the carrier's
 * network), while the raw text is preserved as the event's eventCode.
 */
export function mapCarrierStatusToTrackingStatus(rawStatus: string): TrackingStatus {
  const s = normalizeCarrierStatus(rawStatus);
  if (s.includes("CANCEL")) return "CANCELLED";
  if (s.includes("LOST")) return "LOST";
  if (s.includes("DAMAG")) return "DAMAGED";
  if (s.includes("DELAY")) return "DELAYED";
  if (s.includes("DELIVERED") && (s.includes("RTO") || s.includes("RETURN"))) {
    return "RETURNED";
  }
  if (s.includes("RTO") || s.includes("RETURN")) {
    return s.includes("INITIAT") ? "RETURN_INITIATED" : "RETURNED_TO_ORIGIN";
  }
  if (s.includes("DELIVERED")) return "DELIVERED";
  if (s.includes("OUT FOR DELIVERY")) return "OUT_FOR_DELIVERY";
  if (s.includes("UNDELIVER") || s.includes("ATTEMPT")) return "DELIVERY_ATTEMPTED";
  if (s.includes("PICKED UP") || s.includes("PICKUP COMPLETE") || s.includes("PICKUP DONE")) {
    return "PICKED_UP";
  }
  if (s.includes("PICKUP") || s.includes("PICK UP")) return "PICKUP_SCHEDULED";
  if (s.includes("ARRIVED") || s.includes("REACHED")) return "ARRIVED_AT_HUB";
  if (s.includes("DEPARTED") || s.includes("DISPATCHED")) return "DEPARTED_HUB";
  if (s.includes("BOOKED") || s.includes("CREATED") || s.includes("MANIFEST")) {
    return "SHIPMENT_CREATED";
  }
  return "IN_TRANSIT";
}

const SHIPMENT_STATUS_RANK: Partial<Record<ShipmentStatus, number>> = {
  PENDING: 0,
  READY_TO_SHIP: 1,
  LABEL_GENERATED: 1,
  MANIFEST_GENERATED: 2,
  PICKED_UP: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
};

const TERMINAL_SHIPMENT_STATUSES: ReadonlySet<string> = new Set([
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
]);

/**
 * The shipment status a raw carrier status should advance the shipment to,
 * or null when it implies no lifecycle change. Only ever moves forward:
 * callers compare against the shipment's current status.
 */
export function mapCarrierStatusToShipmentStatus(
  rawStatus: string,
): ShipmentStatus | null {
  const s = normalizeCarrierStatus(rawStatus);
  if (s.includes("CANCEL")) return "CANCELLED";
  if (s.includes("RTO") || s.includes("RETURN")) return "RETURN_TO_ORIGIN";
  if (s.includes("DELIVERED")) return "DELIVERED";
  if (s.includes("OUT FOR DELIVERY")) return "OUT_FOR_DELIVERY";
  if (s.includes("PICKED UP") || s.includes("PICKUP COMPLETE")) return "PICKED_UP";
  if (
    s.includes("IN TRANSIT") ||
    s.includes("TRANSIT") ||
    s.includes("ARRIVED") ||
    s.includes("DEPARTED") ||
    s.includes("DISPATCHED")
  ) {
    return "IN_TRANSIT";
  }
  return null;
}

async function advanceShipmentStatus(
  sellerId: string,
  shipment: ShipmentRow,
  rawCarrierStatus: string,
): Promise<void> {
  const target = mapCarrierStatusToShipmentStatus(rawCarrierStatus);
  if (!target || target === shipment.status) return;
  if (TERMINAL_SHIPMENT_STATUSES.has(shipment.status)) return;
  // Lateral moves (return/cancel) are always allowed out of a live status;
  // forward moves must actually advance the lifecycle.
  if (target !== "RETURN_TO_ORIGIN" && target !== "CANCELLED") {
    const targetRank = SHIPMENT_STATUS_RANK[target] ?? 0;
    const currentRank = SHIPMENT_STATUS_RANK[shipment.status] ?? 0;
    if (targetRank <= currentRank) return;
  }
  await updateShipmentStatus(sellerId, {
    shipmentId: shipment.id,
    status: target,
  });
}

// ---------------------------------------------------------------------------
// Adapter resolution
// ---------------------------------------------------------------------------

/**
 * Factory: build the adapter for a partner row. Only partners with a real
 * API integration land here — INHOUSE/MANUAL partners are rejected by the
 * caller before this is invoked.
 */
export function getCarrierAdapter(
  partner: PartnerRow,
  options: {
    connectionId?: string | null;
    pickupLocationName?: string | null;
    fetchImpl?: CarrierFetch;
  } = {},
): CarrierAdapter {
  switch (partner.partnerCode) {
    case "SHIPROCKET":
      return new ShiprocketAdapter({
        baseUrl: partner.apiBaseUrl,
        connectionId: options.connectionId ?? null,
        pickupLocationName: options.pickupLocationName ?? null,
        fetchImpl: options.fetchImpl,
      });
    default:
      throw new CarrierError(
        "NOT_CONFIGURED",
        `No API adapter is implemented for shipping partner "${partner.partnerName}" (${partner.partnerCode}).`,
      );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Pickup-location nickname stored on the connection's non-secret config. */
function pickupLocationFromConfig(config: unknown): string | null {
  if (isRecord(config)) {
    const value = config["pickupLocation"];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return null;
}

interface ResolvedCarrier {
  adapter: CarrierAdapter;
  partner: PartnerRow;
  credentials: CarrierCredentials;
}

async function loadOwnedShipment(
  sellerId: string,
  shipmentId: string,
): Promise<ShipmentRow> {
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
    throw new NotFoundError("Shipment not found");
  }
  return shipment;
}

/**
 * Resolve (and authenticate) the carrier adapter for a shipment: partner
 * must support API booking, and the seller must hold an ACTIVE connection
 * with decryptable credentials for it.
 */
async function resolveCarrierForShipment(
  sellerId: string,
  shipment: ShipmentRow,
  options: CarrierOperationOptions,
): Promise<ResolvedCarrier> {
  const [partner] = await db
    .select()
    .from(shippingPartners)
    .where(eq(shippingPartners.id, shipment.shippingPartnerId))
    .limit(1);
  if (!partner) {
    throw new NotFoundError("Shipping partner not found");
  }

  if (partner.integrationType === "INHOUSE" || partner.integrationType === "MANUAL") {
    throw new BadRequestError(
      `Shipping partner "${partner.partnerName}" does not support API booking ` +
        `(integration type: ${partner.integrationType}). ` +
        (partner.integrationType === "INHOUSE"
          ? "In-house shipments are fulfilled by delivery executives, not a carrier API."
          : "Book this shipment with the carrier directly and record the AWB on the shipment."),
    );
  }

  const [connection] = await db
    .select()
    .from(sellerCarrierConnections)
    .where(
      and(
        eq(sellerCarrierConnections.sellerId, sellerId),
        eq(sellerCarrierConnections.partnerId, partner.id),
        eq(sellerCarrierConnections.isActive, true),
      ),
    )
    .limit(1);
  if (!connection) {
    throw new CarrierError(
      "NOT_CONFIGURED",
      `No active ${partner.partnerName} connection for this seller. Connect the carrier before booking.`,
    );
  }
  if (!connection.credentialsEncrypted) {
    throw new CarrierError(
      "NOT_CONFIGURED",
      `The ${partner.partnerName} connection has no stored credentials. Reconnect the carrier with its API credentials.`,
    );
  }
  const credentials = decryptCredentials(connection.credentialsEncrypted);

  // Shiprocket-style pickup locations are identified by a nickname held in
  // the provider account: prefer the connection's configured pickup
  // location, fall back to the seller's delivery-settings hub name, and
  // let the adapter apply its own default after that.
  let pickupLocationName = pickupLocationFromConfig(connection.config);
  if (!pickupLocationName) {
    const settings = await getDeliverySettingsRepo(sellerId);
    pickupLocationName = settings.pickupHub.hubName || null;
  }

  const adapter = getCarrierAdapter(partner, {
    connectionId: connection.id,
    pickupLocationName,
    fetchImpl: options.fetchImpl,
  });
  await adapter.authenticate(credentials);
  return { adapter, partner, credentials };
}

// ---------------------------------------------------------------------------
// Booking input assembly
// ---------------------------------------------------------------------------

async function assembleBookingInput(
  sellerId: string,
  shipment: ShipmentRow,
): Promise<CreateBookingInput> {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, shipment.orderId))
    .limit(1);
  if (!order) {
    throw new NotFoundError("Order not found for this shipment");
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  if (items.length === 0) {
    throw new BadRequestError("Cannot book a shipment for an order with no items.");
  }

  const addressRows = await db
    .select()
    .from(orderAddresses)
    .where(eq(orderAddresses.orderId, order.id))
    .orderBy(desc(orderAddresses.createdAt));
  const delivery = addressRows.find((a) => a.addressType === "DELIVERY");
  if (!delivery) {
    throw new BadRequestError(
      "Cannot book this shipment: the order has no delivery address. Add the delivery address first.",
    );
  }

  // Pickup: the seller's delivery-settings hub when one is configured,
  // otherwise their default PICKUP address from seller_addresses.
  const settings = await getDeliverySettingsRepo(sellerId);
  const [sellerRow] = await db
    .select({ name: seller.name, email: seller.email })
    .from(seller)
    .where(eq(seller.id, sellerId))
    .limit(1);

  let pickupAddress: CreateBookingInput["pickupAddress"];
  if (settings.pickupHub.address) {
    pickupAddress = {
      name: settings.pickupHub.hubName || sellerRow?.name || "Seller",
      phone: settings.pickupHub.phone,
      email: sellerRow?.email ?? null,
      addressLine1: settings.pickupHub.address,
      city: settings.pickupHub.city,
      state: "",
      postalCode: settings.pickupHub.pincode,
      country: "India",
    };
  } else {
    const pickupRows = await db
      .select()
      .from(sellerAddresses)
      .where(
        and(
          eq(sellerAddresses.sellerId, sellerId),
          eq(sellerAddresses.addressType, "PICKUP"),
          eq(sellerAddresses.isActive, true),
        ),
      )
      .orderBy(desc(sellerAddresses.isDefault));
    const pickup = pickupRows[0];
    if (!pickup) {
      throw new BadRequestError(
        "Cannot book this shipment: no pickup location is configured. Set the pickup hub in delivery settings first.",
      );
    }
    pickupAddress = {
      name: pickup.contactPerson ?? pickup.label,
      phone: pickup.contactPhone ?? "",
      email: sellerRow?.email ?? null,
      addressLine1: pickup.addressLine1,
      addressLine2: pickup.addressLine2,
      city: pickup.city,
      state: pickup.state,
      postalCode: pickup.postalCode,
      country: "India",
    };
  }

  const isCod = order.paymentMethod === "COD";
  const shipmentCod = Number(shipment.codAmount);
  const codAmount = isCod
    ? shipmentCod > 0
      ? shipmentCod
      : Number(order.grandTotal)
    : 0;

  const totalWeightKg = items.reduce(
    (sum, item) => sum + Number(item.weight ?? 0) * item.quantity,
    0,
  );
  const maxOf = (values: Array<string | null>): number | undefined => {
    const nums = values
      .map((v) => (v == null ? NaN : Number(v)))
      .filter((n) => Number.isFinite(n) && n > 0);
    return nums.length > 0 ? Math.max(...nums) : undefined;
  };
  const lengthCm = maxOf(items.map((i) => i.length));
  const breadthCm = maxOf(items.map((i) => i.width));
  const heightCm = maxOf(items.map((i) => i.height));

  return {
    order: {
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      isCod,
      subTotal: Number(order.subtotal),
      shippingCharge: Number(order.shippingCharge ?? 0),
      discount: Number(order.discountAmount ?? 0) + Number(order.couponDiscount ?? 0),
    },
    items: items.map((item) => ({
      name: item.productName,
      sku: item.variantSku ?? item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
    pickupAddress,
    deliveryAddress: {
      name: delivery.recipientName || order.buyerName,
      phone: delivery.phoneNumber || order.buyerPhone,
      email: order.buyerEmail,
      addressLine1: delivery.addressLine1,
      addressLine2: delivery.addressLine2,
      city: delivery.city,
      state: delivery.state,
      postalCode: delivery.postalCode,
      country: delivery.country || "India",
    },
    codAmount,
    weightKg: totalWeightKg > 0 ? totalWeightKg : undefined,
    dimensionsCm:
      lengthCm != null && breadthCm != null && heightCm != null
        ? { lengthCm, breadthCm, heightCm }
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// Provider shipment id (stored in the CARRIER_BOOKED event's rawPayload)
// ---------------------------------------------------------------------------

export async function getProviderShipmentId(
  shipmentId: string,
): Promise<string | null> {
  const [event] = await db
    .select({ rawPayload: shipmentTrackingEvents.rawPayload })
    .from(shipmentTrackingEvents)
    .where(
      and(
        eq(shipmentTrackingEvents.shipmentId, shipmentId),
        eq(shipmentTrackingEvents.eventCode, "CARRIER_BOOKED"),
      ),
    )
    .orderBy(desc(shipmentTrackingEvents.occurredAt))
    .limit(1);
  if (!event || !isRecord(event.rawPayload)) return null;
  const value = event.rawPayload["providerShipmentId"];
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "number") return String(value);
  return null;
}

// ---------------------------------------------------------------------------
// Public operations
// ---------------------------------------------------------------------------

/**
 * Book one of the session seller's shipments with its carrier: assemble
 * the provider order from the platform order, persist the returned AWB /
 * tracking number / label URL, move the shipment to READY_TO_SHIP (or
 * LABEL_GENERATED when a label came back), and record a CARRIER_BOOKED
 * tracking event (whose rawPayload carries the provider shipment id —
 * see the storage note at the top of this file).
 */
export async function bookShipmentWithCarrier(
  shipmentId: string,
  options: CarrierOperationOptions = {},
): Promise<BookShipmentResult> {
  const sessionSeller = await getCurrentSellerOrThrow();
  const shipment = await loadOwnedShipment(sessionSeller.id, shipmentId);

  if (shipment.awbNumber) {
    throw new BadRequestError(
      `Shipment ${shipment.shipmentNumber} already has AWB ${shipment.awbNumber}; it cannot be booked again.`,
    );
  }

  const { adapter, partner } = await resolveCarrierForShipment(
    sessionSeller.id,
    shipment,
    options,
  );
  const input = await assembleBookingInput(sessionSeller.id, shipment);
  const booking = await adapter.createBooking(input);

  const now = new Date();
  const [updated] = await db
    .update(shipmentOrders)
    .set({
      awbNumber: booking.awb,
      trackingNumber: booking.awb,
      labelUrl: booking.labelUrl,
      labelGeneratedAt: booking.labelUrl ? now : null,
      status: booking.labelUrl ? "LABEL_GENERATED" : "READY_TO_SHIP",
      updatedAt: now,
    })
    .where(eq(shipmentOrders.id, shipment.id))
    .returning();
  if (!updated) {
    throw new NotFoundError("Shipment not found");
  }

  await db.insert(shipmentTrackingEvents).values({
    shipmentId: shipment.id,
    trackingStatus: "SHIPMENT_CREATED",
    eventCode: "CARRIER_BOOKED",
    eventDescription:
      `Booked with ${partner.partnerName}` +
      (booking.courierName ? ` — courier: ${booking.courierName}` : "") +
      (booking.awb ? ` — AWB: ${booking.awb}` : " — AWB pending assignment"),
    occurredAt: now,
    rawPayload: {
      provider: partner.partnerCode,
      providerOrderId: booking.providerOrderId,
      providerShipmentId: booking.providerShipmentId,
      courierName: booking.courierName,
      awb: booking.awb,
    },
  });

  return { shipment: updated, booking };
}

/**
 * Generate (or regenerate) the carrier label for a booked shipment and
 * store the label URL on the shipment row.
 */
export async function generateShipmentLabel(
  shipmentId: string,
  options: CarrierOperationOptions = {},
): Promise<{ labelUrl: string; shipment: ShipmentRow }> {
  const sessionSeller = await getCurrentSellerOrThrow();
  const shipment = await loadOwnedShipment(sessionSeller.id, shipmentId);
  const { adapter, partner } = await resolveCarrierForShipment(
    sessionSeller.id,
    shipment,
    options,
  );

  const providerShipmentId = await getProviderShipmentId(shipment.id);
  if (!providerShipmentId) {
    throw new BadRequestError(
      "This shipment has not been booked with the carrier yet, so no label can be generated. Book the shipment first.",
    );
  }

  const { labelUrl } = await adapter.generateLabel(providerShipmentId);
  const now = new Date();
  const nextStatus: ShipmentStatus | null =
    shipment.status === "PENDING" || shipment.status === "READY_TO_SHIP"
      ? "LABEL_GENERATED"
      : null;

  const [updated] = await db
    .update(shipmentOrders)
    .set({
      labelUrl,
      labelGeneratedAt: now,
      ...(nextStatus ? { status: nextStatus } : {}),
      updatedAt: now,
    })
    .where(eq(shipmentOrders.id, shipment.id))
    .returning();
  if (!updated) {
    throw new NotFoundError("Shipment not found");
  }

  await db.insert(shipmentTrackingEvents).values({
    shipmentId: shipment.id,
    trackingStatus: "SHIPMENT_CREATED",
    eventCode: "LABEL_GENERATED",
    eventDescription: `Shipping label generated via ${partner.partnerName}`,
    occurredAt: now,
    rawPayload: { provider: partner.partnerCode, providerShipmentId, labelUrl },
  });

  return { labelUrl, shipment: updated };
}

/**
 * Pull the carrier's tracking for a shipment, append any scan events we
 * have not recorded yet (dedupe: shipment + raw status + occurred-at),
 * and advance the shipment status for delivered / out-for-delivery style
 * reports via the delivery repository (which also syncs the order).
 */
export async function syncShipmentTracking(
  shipmentId: string,
  options: CarrierOperationOptions = {},
): Promise<SyncTrackingResult> {
  const sessionSeller = await getCurrentSellerOrThrow();
  const shipment = await loadOwnedShipment(sessionSeller.id, shipmentId);
  if (!shipment.awbNumber) {
    throw new BadRequestError(
      "This shipment has no AWB yet, so there is nothing to track. Book it with the carrier first.",
    );
  }

  const { adapter } = await resolveCarrierForShipment(
    sessionSeller.id,
    shipment,
    options,
  );
  const result = await adapter.track(shipment.awbNumber);

  const existing = await db
    .select({
      eventCode: shipmentTrackingEvents.eventCode,
      occurredAt: shipmentTrackingEvents.occurredAt,
    })
    .from(shipmentTrackingEvents)
    .where(eq(shipmentTrackingEvents.shipmentId, shipment.id));
  const seen = new Set(
    existing.map((e) => `${e.eventCode ?? ""}|${e.occurredAt.getTime()}`),
  );

  let inserted = 0;
  for (const event of result.events) {
    const key = `${event.status}|${event.occurredAt.getTime()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await db.insert(shipmentTrackingEvents).values({
      shipmentId: shipment.id,
      trackingStatus: mapCarrierStatusToTrackingStatus(event.status),
      eventCode: event.status,
      eventDescription: event.description,
      locationName: event.location ?? null,
      occurredAt: event.occurredAt,
      rawPayload: { source: "carrier_track_sync", status: event.status },
    });
    inserted += 1;
  }

  await advanceShipmentStatus(sessionSeller.id, shipment, result.currentStatus);

  return {
    shipmentId: shipment.id,
    currentStatus: result.currentStatus,
    eventsReceived: result.events.length,
    eventsInserted: inserted,
  };
}

// ---------------------------------------------------------------------------
// Shiprocket webhook
// ---------------------------------------------------------------------------

export interface ShiprocketWebhookResult {
  ignored: boolean;
  shipmentId?: string;
  duplicate?: boolean;
}

function parseWebhookTimestamp(payload: Record<string, unknown>): Date {
  for (const key of ["current_timestamp", "timestamp"]) {
    const value = payload[key];
    if (typeof value === "string") {
      const parsed = new Date(value.replace(" ", "T"));
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }
  return new Date();
}

/**
 * Apply one Shiprocket tracking webhook payload: locate the shipment by
 * AWB, record the status as a tracking event (deduped — Shiprocket
 * retries webhooks), and advance the shipment status for terminal states
 * through the delivery repository so the parent order stays in sync.
 * Unknown AWBs are reported as ignored so the route can ack them (a 200
 * stops the provider retrying forever for shipments we do not own).
 */
export async function handleShiprocketWebhook(
  payload: unknown,
): Promise<ShiprocketWebhookResult> {
  if (!isRecord(payload)) return { ignored: true };

  const awbValue = payload["awb"] ?? payload["awb_code"];
  if (typeof awbValue !== "string" || awbValue.length === 0) {
    return { ignored: true };
  }

  const [shipment] = await db
    .select()
    .from(shipmentOrders)
    .where(eq(shipmentOrders.awbNumber, awbValue))
    .limit(1);
  if (!shipment) return { ignored: true };

  const statusValue = payload["current_status"] ?? payload["shipment_status"];
  const rawStatus =
    typeof statusValue === "string" && statusValue.length > 0
      ? statusValue
      : "UNKNOWN";
  const occurredAt = parseWebhookTimestamp(payload);
  const courierName =
    typeof payload["courier_name"] === "string" ? payload["courier_name"] : null;

  const [existingEvent] = await db
    .select({ id: shipmentTrackingEvents.id })
    .from(shipmentTrackingEvents)
    .where(
      and(
        eq(shipmentTrackingEvents.shipmentId, shipment.id),
        eq(shipmentTrackingEvents.eventCode, rawStatus),
        eq(shipmentTrackingEvents.occurredAt, occurredAt),
      ),
    )
    .limit(1);

  if (existingEvent) {
    return { ignored: false, shipmentId: shipment.id, duplicate: true };
  }

  await db.insert(shipmentTrackingEvents).values({
    shipmentId: shipment.id,
    trackingStatus: mapCarrierStatusToTrackingStatus(rawStatus),
    eventCode: rawStatus,
    eventDescription:
      `Shiprocket update: ${rawStatus}` +
      (courierName ? ` (${courierName})` : ""),
    occurredAt,
    rawPayload: payload,
  });

  await advanceShipmentStatus(shipment.sellerId, shipment, rawStatus);

  return { ignored: false, shipmentId: shipment.id };
}
