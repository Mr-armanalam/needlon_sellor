import { db } from "@/db";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@/db/schema/delivery/shipping-method";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { and, eq, isNull, sql } from "drizzle-orm";
import {
  CreateShipmentOrderDto,
  UpdateShipmentStatusDto,
  ConnectCarrierDto,
  LocalDeliverySettingsDto,
  PickupHubDto,
  ShippingZoneDto,
} from "../dto/delivery.dto";

// In-Memory store for Seller Settings (Radius, Hub, Zones) for fast access and fallback
let inMemoryDeliverySettings: {
  localRadius: LocalDeliverySettingsDto;
  pickupHub: PickupHubDto;
  zones: ShippingZoneDto[];
} = {
  localRadius: {
    maxRadiusKm: 15,
    baseCharge: 5.0,
    freeShippingThreshold: 100.0,
  },
  pickupHub: {
    hubName: "Needlon Hub Main Warehouse",
    address: "Needlon Hub Main Warehouse Block-C, Industrial Electronics Sector",
    city: "Pimpri-Chinchwad",
    pincode: "411019",
    phone: "+91 98765 43210",
    operatingHours: "Mon-Sat: 9:00 AM - 7:00 PM",
  },
  zones: [
    { zoneName: "Domestic (All States)", partnerCode: "FEDEX", flatRateFee: 12.0, estimatedDays: "2-4 days" },
    { zoneName: "International (EU & NA)", partnerCode: "DHL", flatRateFee: 45.0, estimatedDays: "4-7 days" },
    { zoneName: "Local Express", partnerCode: "INHOUSE", flatRateFee: 5.0, estimatedDays: "Same Day" },
  ],
};

export async function getShippingPartners() {
  const partners = await db
    .select()
    .from(shippingPartners)
    .orderBy(shippingPartners.displayOrder);

  if (partners.length === 0) {
    // Seed initial default shipping partners if empty
    const seeded = await db
      .insert(shippingPartners)
      .values([
        {
          partnerCode: "FEDEX",
          partnerName: "FedEx Express (Sandbox)",
          websiteUrl: "https://www.fedex.com",
          supportsCod: true,
          supportsPickup: true,
          isActive: true,
          displayOrder: 1,
        },
        {
          partnerCode: "SHIPROCKET",
          partnerName: "Shiprocket India (Sandbox API)",
          websiteUrl: "https://www.shiprocket.in",
          supportsCod: true,
          supportsPickup: true,
          isActive: true,
          displayOrder: 2,
        },
        {
          partnerCode: "SHIPPO",
          partnerName: "Shippo Test API (Global)",
          websiteUrl: "https://goshippo.com",
          supportsCod: false,
          supportsPickup: true,
          isActive: true,
          displayOrder: 3,
        },
        {
          partnerCode: "INHOUSE",
          partnerName: "In-House Local Fleet",
          supportsCod: true,
          supportsPickup: true,
          isActive: true,
          displayOrder: 4,
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

export async function updateShippingPartnerRepo(dto: ConnectCarrierDto) {
  const [updated] = await db
    .update(shippingPartners)
    .set({
      isActive: dto.isActive,
      updatedAt: new Date(),
    })
    .where(eq(shippingPartners.id, dto.partnerId))
    .returning();

  return updated || { id: dto.partnerId, partnerCode: dto.partnerCode, isActive: dto.isActive };
}

export async function getShippingMethodsForPartner(partnerId: string) {
  return db
    .select()
    .from(shippingMethods)
    .where(and(eq(shippingMethods.partnerId, partnerId), eq(shippingMethods.isActive, true)))
    .orderBy(shippingMethods.displayOrder);
}

export async function getDeliverySettingsRepo() {
  return inMemoryDeliverySettings;
}

export async function updateLocalDeliverySettingsRepo(dto: LocalDeliverySettingsDto) {
  inMemoryDeliverySettings.localRadius = dto;
  return inMemoryDeliverySettings.localRadius;
}

export async function updatePickupHubRepo(dto: PickupHubDto) {
  inMemoryDeliverySettings.pickupHub = dto;
  return inMemoryDeliverySettings.pickupHub;
}

export async function addShippingZoneRepo(dto: ShippingZoneDto) {
  inMemoryDeliverySettings.zones.push(dto);
  return inMemoryDeliverySettings.zones;
}

export async function createShipmentOrder(sellerId: string, dto: CreateShipmentOrderDto) {
  const partners = await getShippingPartners();
  const partner = partners.find((p) => p.id === dto.shippingPartnerId) || partners[0];
  const methods = await getShippingMethodsForPartner(partner.id);
  const methodId = methods[0]?.id || partner.id;

  const shipmentNumber = `SHP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const [inserted] = await db
    .insert(shipmentOrders)
    .values({
      sellerId,
      orderId: dto.orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: dto.buyerId || sellerId,
      shippingPartnerId: partner.id,
      shippingMethodId: methodId,
      shipmentNumber,
      awbNumber: dto.awbNumber || `${partner.partnerCode.slice(0, 3)}-AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
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

  if (rows.length === 0) {
    // Return mock active shipments if none yet in DB
    return [
      {
        id: "shp-1",
        orderId: "ORD-98234",
        shipmentNumber: "SHP-K891-921",
        awbNumber: "FDX-AWB-89127381",
        trackingNumber: "TRK-98127389",
        partnerName: "FedEx Express (Sandbox)",
        methodName: "FedEx Standard Air",
        status: "IN_TRANSIT",
        shippingCost: "12.00",
        estimatedDeliveryAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
        shippedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        deliveredAt: null,
      },
      {
        id: "shp-2",
        orderId: "ORD-98235",
        shipmentNumber: "SHP-K891-922",
        awbNumber: "SR-AWB-47192831",
        trackingNumber: "TRK-47192831",
        partnerName: "Shiprocket India (Sandbox API)",
        methodName: "Surface Express",
        status: "READY_FOR_PICKUP",
        shippingCost: "8.50",
        estimatedDeliveryAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        shippedAt: null,
        deliveredAt: null,
      },
    ];
  }

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

  return updated || { id: dto.shipmentId, status: dto.status };
}
