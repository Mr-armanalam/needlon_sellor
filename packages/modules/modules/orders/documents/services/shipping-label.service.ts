import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shipmentTrackingEvents } from "@/db/schema/delivery/shipping-tracking-events";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { and, desc, eq, isNull } from "drizzle-orm";
import type { ShippingLabelData } from "../types";

/**
 * Error thrown when a shipping label cannot be built for an order.
 * `code` lets API routes map the failure to an HTTP status:
 *  - "ORDER_NOT_FOUND": no (visible) order with that id — 404
 *  - "NO_SHIPMENT": the order has no shipment yet — 404; the seller must
 *    create a shipment before a label can exist, because the label's courier
 *    and tracking identity come from the shipment, never from the order.
 */
export class ShippingLabelError extends Error {
  constructor(
    public readonly code: "ORDER_NOT_FOUND" | "NO_SHIPMENT",
    message: string
  ) {
    super(message);
    this.name = "ShippingLabelError";
  }
}

type OrderItemRecord = typeof orderItems.$inferSelect;

/**
 * Total parcel weight in kg from real sources only:
 *  1. the order item's snapshot `weight` column (kg), else
 *  2. the product variant's `weightGrams`.
 * Returns undefined when no item carries weight data — the label then omits
 * the weight line instead of printing an invented figure.
 */
async function computeWeightKg(items: OrderItemRecord[]): Promise<number | undefined> {
  let totalKg = 0;
  let hasWeight = false;

  for (const item of items) {
    const quantity = item.quantity || 1;
    let itemKg: number | null = null;

    if (item.weight != null) {
      const parsed = parseFloat(item.weight.toString());
      if (!Number.isNaN(parsed) && parsed > 0) {
        itemKg = parsed;
      }
    }

    if (itemKg === null && item.variantId) {
      const [variant] = await db
        .select({ weightGrams: productVariantsTable.weightGrams })
        .from(productVariantsTable)
        .where(eq(productVariantsTable.id, item.variantId))
        .limit(1);
      if (variant?.weightGrams != null && variant.weightGrams > 0) {
        itemKg = variant.weightGrams / 1000;
      }
    }

    if (itemKg !== null) {
      totalKg += itemKg * quantity;
      hasWeight = true;
    }
  }

  return hasWeight && totalKg > 0 ? totalKg : undefined;
}

/**
 * Assemble the data for an order's shipping label from the order's LATEST
 * shipment. The courier name and tracking identity are the shipment's real
 * partner name and carrier AWB — never synthesized from the order number.
 *
 * Side effect: the first time a label is built for a shipment that is still
 * PENDING or READY_TO_SHIP, the shipment advances to LABEL_GENERATED
 * (labelGeneratedAt stamped) and a LABEL_GENERATED tracking event is recorded.
 *
 * @param orderId  the order id
 * @param sellerId when provided, the order lookup is scoped to this seller
 *                 (API routes pass the session seller; internal callers may omit)
 */
export async function buildShippingLabelData(
  orderId: string,
  sellerId?: string
): Promise<ShippingLabelData> {
  const orderConditions = [eq(orders.id, orderId), isNull(orders.deletedAt)];
  if (sellerId) {
    orderConditions.push(eq(orders.sellerId, sellerId));
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(and(...orderConditions))
    .limit(1);

  if (!order) {
    throw new ShippingLabelError("ORDER_NOT_FOUND", "Order not found");
  }

  const [shipment] = await db
    .select({
      shipment: shipmentOrders,
      partnerName: shippingPartners.partnerName,
    })
    .from(shipmentOrders)
    .innerJoin(
      shippingPartners,
      eq(shipmentOrders.shippingPartnerId, shippingPartners.id)
    )
    .where(eq(shipmentOrders.orderId, order.id))
    .orderBy(desc(shipmentOrders.createdAt))
    .limit(1);

  if (!shipment) {
    throw new ShippingLabelError(
      "NO_SHIPMENT",
      "Create a shipment before generating a label"
    );
  }

  const shipmentRow = shipment.shipment;
  const trackingNumber =
    shipmentRow.awbNumber ?? shipmentRow.trackingNumber ?? shipmentRow.shipmentNumber;

  const itemsList = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const addresses = await db
    .select()
    .from(orderAddresses)
    .where(eq(orderAddresses.orderId, order.id));
  const deliveryAddress =
    addresses.find((a) => a.addressType === "DELIVERY") || addresses[0];

  const [store] = await db
    .select()
    .from(sellerStore)
    .where(eq(sellerStore.sellerId, order.sellerId))
    .limit(1);

  const [sellerAddr] = await db
    .select()
    .from(sellerAddresses)
    .where(eq(sellerAddresses.sellerId, order.sellerId))
    .limit(1);

  const weightKg = await computeWeightKg(itemsList);

  const isCod = order.paymentMethod === "COD";
  const grandTotal = parseFloat(order.grandTotal?.toString() || "0");
  const totalQty = itemsList.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const labelData: ShippingLabelData = {
    orderNumber: order.orderNumber,
    trackingNumber,
    courierName: shipment.partnerName,
    isCod,
    codAmount: isCod ? grandTotal : 0,
    weightKg,
    seller: {
      storeName: store?.storeName ?? "",
      phone: store?.supportPhone ?? "",
      address: {
        recipientName: store?.storeName ?? "",
        addressLine1: sellerAddr?.addressLine1 ?? "",
        city: sellerAddr?.city ?? "",
        state: sellerAddr?.state ?? "",
        postalCode: sellerAddr?.postalCode ?? "",
      },
    },
    buyer: {
      name: order.buyerName,
      phone: order.buyerPhone,
      shippingAddress: {
        recipientName: deliveryAddress?.recipientName ?? order.buyerName,
        addressLine1: deliveryAddress?.addressLine1 ?? "",
        addressLine2: deliveryAddress?.addressLine2 ?? undefined,
        city: deliveryAddress?.city ?? "",
        state: deliveryAddress?.state ?? "",
        postalCode: deliveryAddress?.postalCode ?? "",
      },
    },
    itemSummary: `${totalQty}x ${itemsList[0]?.productName ?? ""}`,
    date: new Date(order.createdAt).toLocaleDateString("en-IN"),
  };

  // First label build advances the shipment and records the tracking event.
  if (shipmentRow.status === "PENDING" || shipmentRow.status === "READY_TO_SHIP") {
    const now = new Date();
    await db
      .update(shipmentOrders)
      .set({ status: "LABEL_GENERATED", labelGeneratedAt: now, updatedAt: now })
      .where(eq(shipmentOrders.id, shipmentRow.id));
    await db.insert(shipmentTrackingEvents).values({
      shipmentId: shipmentRow.id,
      trackingStatus: "SHIPMENT_CREATED",
      eventCode: "LABEL_GENERATED",
      eventDescription: "Shipping label generated",
      occurredAt: now,
    });
  }

  return labelData;
}
