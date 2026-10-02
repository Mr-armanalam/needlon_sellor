import { db } from "@/db";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@/db/schema/delivery/shipping-method";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { and, eq, isNull, sql } from "drizzle-orm";
import { CreateShipmentOrderDto, UpdateShipmentStatusDto } from "../dto/delivery.dto";

export async function getShippingPartners() {
  const partners = await db
    .select()
    .from(shippingPartners)
    .where(eq(shippingPartners.isActive, true))
    .orderBy(shippingPartners.displayOrder);

  if (partners.length === 0) {
    // Seed initial default shipping partners if empty
    const seeded = await db
      .insert(shippingPartners)
      .values([
        {
          partnerCode: "FEDEX",
          partnerName: "FedEx Express",
          websiteUrl: "https://www.fedex.com",
          supportsCod: true,
          supportsPickup: true,
          displayOrder: 1,
        },
        {
          partnerCode: "DHL",
          partnerName: "DHL International",
          websiteUrl: "https://www.dhl.com",
          supportsCod: false,
          supportsPickup: true,
          displayOrder: 2,
        },
        {
          partnerCode: "INHOUSE",
          partnerName: "In-House Local Fleet",
          supportsCod: true,
          supportsPickup: true,
          displayOrder: 3,
        },
      ])
      .returning();

    // Create default method for each
    for (const p of seeded) {
      await db.insert(shippingMethods).values({
        partnerId: p.id,
        methodCode: `${p.partnerCode}_STD`,
        methodName: `${p.partnerName} Standard`,
        estimatedMinDays: 1,
        estimatedMaxDays: 3,
        supportsCod: p.supportsCod,
      });
    }

    return seeded;
  }

  return partners;
}

export async function getShippingMethodsForPartner(partnerId: string) {
  return db
    .select()
    .from(shippingMethods)
    .where(and(eq(shippingMethods.partnerId, partnerId), eq(shippingMethods.isActive, true)))
    .orderBy(shippingMethods.displayOrder);
}

export async function createShipmentOrder(sellerId: string, dto: CreateShipmentOrderDto) {
  const shipmentNumber = `SHP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const [inserted] = await db
    .insert(shipmentOrders)
    .values({
      sellerId,
      orderId: dto.orderId,
      buyerId: dto.buyerId,
      shippingPartnerId: dto.shippingPartnerId,
      shippingMethodId: dto.shippingMethodId,
      shipmentNumber,
      awbNumber: dto.awbNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingNumber: dto.trackingNumber || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: "PENDING",
      shippingCost: dto.shippingCost.toString(),
      codAmount: dto.codAmount.toString(),
      notes: dto.notes,
    })
    .returning();

  return inserted;
}

export async function getSellerShipments(sellerId: string, statusFilter?: string) {
  const conditions = [eq(shipmentOrders.sellerId, sellerId)];
  if (statusFilter && statusFilter !== "ALL") {
    conditions.push(eq(shipmentOrders.status, statusFilter as any));
  }

  const rows = await db
    .select({
      id: shipmentOrders.id,
      orderId: shipmentOrders.orderId,
      shipmentNumber: shipmentOrders.shipmentNumber,
      awbNumber: shipmentOrders.awbNumber,
      trackingNumber: shipmentOrders.trackingNumber,
      status: shipmentOrders.status,
      shippingCost: shipmentOrders.shippingCost,
      estimatedDeliveryAt: shipmentOrders.estimatedDeliveryAt,
      shippedAt: shipmentOrders.shippedAt,
      deliveredAt: shipmentOrders.deliveredAt,
      partnerName: shippingPartners.partnerName,
      methodName: shippingMethods.methodName,
    })
    .from(shipmentOrders)
    .innerJoin(shippingPartners, eq(shipmentOrders.shippingPartnerId, shippingPartners.id))
    .innerJoin(shippingMethods, eq(shipmentOrders.shippingMethodId, shippingMethods.id))
    .where(and(...conditions))
    .orderBy(sql`${shipmentOrders.createdAt} DESC`);

  return rows.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    shipmentNumber: r.shipmentNumber,
    awbNumber: r.awbNumber,
    trackingNumber: r.trackingNumber,
    partnerName: r.partnerName,
    methodName: r.methodName,
    status: r.status,
    shippingCost: r.shippingCost,
    estimatedDeliveryAt: r.estimatedDeliveryAt ? r.estimatedDeliveryAt.toISOString() : null,
    shippedAt: r.shippedAt ? r.shippedAt.toISOString() : null,
    deliveredAt: r.deliveredAt ? r.deliveredAt.toISOString() : null,
  }));
}

export async function updateShipmentStatus(dto: UpdateShipmentStatusDto) {
  const updatePayload: Record<string, any> = {
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

  const [updated] = await db
    .update(shipmentOrders)
    .set(updatePayload)
    .where(eq(shipmentOrders.id, dto.shipmentId))
    .returning();

  return updated;
}
