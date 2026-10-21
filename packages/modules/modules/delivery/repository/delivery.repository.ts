import { db } from "@/db";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@/db/schema/delivery/shipping-method";
import {
  shipmentOrders,
  shipmentStatusEnum,
} from "@/db/schema/delivery/shipping-orders";
import { orders } from "@/db/schema/orders/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { and, eq, isNull, sql } from "drizzle-orm";
import {
  CreateShipmentOrderDto,
  UpdateShipmentStatusDto,
  ConnectCarrierDto,
  LocalDeliverySettingsDto,
  PickupHubDto,
  ShippingZoneDto,
  AssignDeliveryExecutiveDto,
  AddOrderDeliveryAddressDto,
  DeliveryExecutiveDto,
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
    id: "hub-main-pimpri",
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
  // 1. Find all active orders for this seller
  const sellerOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      sellerId: orders.sellerId,
      buyerId: orders.buyerId,
      buyerName: orders.buyerName,
      status: orders.status,
      shippingCharge: orders.shippingCharge,
      grandTotal: orders.grandTotal,
      paymentMethod: orders.paymentMethod,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
    .orderBy(sql`${orders.createdAt} DESC`);

  // 2. Ensure default shipping partners and methods exist
  const partners = await getShippingPartners();
  const defaultPartner = partners.find((p) => p.partnerCode === "INHOUSE") || partners[0];
  const methods = defaultPartner
    ? await getShippingMethodsForPartner(defaultPartner.id)
    : [];
  // Auto-seeding below needs a real shipping method; without one there is
  // nothing valid to seed (substituting the partner id would violate the FK).
  const defaultMethod = methods[0];

  // 3. Ensure a shipment_orders record exists for each seller order
  for (const ord of sellerOrders) {
    const existing = await db
      .select({ id: shipmentOrders.id })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.orderId, ord.id))
      .limit(1);

    if (existing.length === 0 && defaultPartner && defaultMethod) {
      const isDelivered = ord.status === "DELIVERED";
      const isOut = ord.status === "OUT_FOR_DELIVERY";
      const isShipped = ord.status === "SHIPPED";
      const initialStatus = isDelivered
        ? "DELIVERED"
        : isOut
        ? "OUT_FOR_DELIVERY"
        : isShipped
        ? "IN_TRANSIT"
        : "READY_TO_SHIP";


      const cleanNum = (ord.orderNumber || ord.id).replace(/[^a-zA-Z0-9]/g, "").slice(-8);

      try {
        await db.insert(shipmentOrders).values({
          sellerId: ord.sellerId,
          orderId: ord.id,
          buyerId: ord.buyerId,
          shippingPartnerId: defaultPartner.id,
          shippingMethodId: defaultMethod.id,
          shipmentNumber: `SHP-${cleanNum}`,
          awbNumber: `LOCAL-AWB-${cleanNum}`,
          trackingNumber: `TRK-${cleanNum}`,
          status: initialStatus,
          shippingCost: ord.shippingCharge ? String(ord.shippingCharge) : "0.00",
          codAmount: ord.paymentMethod === "COD" ? String(ord.grandTotal) : "0.00",
          notes: null,
        });
      } catch (insertErr) {
        console.warn("Failed to auto-seed shipment order row for order:", ord.id, insertErr);
      }
    }
  }

  // 4. Query all shipment orders for this seller with joined details
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

  return rows.map((r) => {
    let executive: DeliveryExecutiveDto | null = null;
    if (r.notes) {
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


export async function updateShipmentStatus(dto: UpdateShipmentStatusDto) {
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

  const [updated] = await db
    .update(shipmentOrders)
    .set(updatePayload)
    .where(eq(shipmentOrders.id, dto.shipmentId))
    .returning();

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

  return updated || { id: dto.shipmentId, status: dto.status };
}

export async function assignDeliveryExecutiveRepo(sellerId: string, orderId: string, dto: AssignDeliveryExecutiveDto) {
  // 1. Verify order exists and belongs to seller
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

  // 2. Resolve carrier partner and method
  const partners = await getShippingPartners();
  const matchedPartner = partners.find(
    (p) => p.partnerName.toLowerCase().includes(dto.courierPartner.toLowerCase()) || p.partnerCode === "INHOUSE"
  ) || partners[0];
  const methods = await getShippingMethodsForPartner(matchedPartner.id);
  // A shipment requires a real shipping method. (Previously the partner's
  // own id was substituted when the partner had no methods, which always
  // violated the shipping_methods FK.) Only used when a new shipment row
  // has to be created; an existing shipment keeps its carrier and method.
  const matchedMethod = methods[0];

  const executiveData = {
    executiveName: dto.executiveName,
    executivePhone: dto.executivePhone,
    vehicleType: dto.vehicleType || "Bike / Two Wheeler",
    courierPartner: dto.courierPartner || "In-House Local Delivery",
    trackingNumber: dto.trackingNumber || `TRK-EX-${Date.now().toString().slice(-6)}`,
    notes: dto.notes || null,
    assignedAt: new Date().toISOString(),
  };

  const executiveNotesJson = JSON.stringify(executiveData);

  // 3. Locate or insert shipment_orders row
  const [existingShipment] = await db
    .select()
    .from(shipmentOrders)
    .where(eq(shipmentOrders.orderId, actualOrderId))
    .limit(1);

  const targetStatus: (typeof shipmentOrders)["$inferInsert"]["status"] =
    dto.status || "OUT_FOR_DELIVERY";

  let updatedShipment;
  if (existingShipment) {
    // Keep the carrier/method chosen when the shipment was created;
    // assigning an executive must not silently switch the delivery partner.
    [updatedShipment] = await db
      .update(shipmentOrders)
      .set({
        trackingNumber: executiveData.trackingNumber,
        status: targetStatus,
        notes: executiveNotesJson,
        shippedAt: dto.status === "OUT_FOR_DELIVERY" || dto.status === "IN_TRANSIT" ? new Date() : existingShipment.shippedAt,
        deliveredAt: dto.status === "DELIVERED" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(shipmentOrders.id, existingShipment.id))
      .returning();
  } else {
    if (!matchedMethod) {
      throw new Error(
        `Shipping partner "${matchedPartner.partnerName}" has no shipping methods configured`
      );
    }
    const cleanNum = (orderRecord.orderNumber || orderRecord.id).replace(/[^a-zA-Z0-9]/g, "").slice(-8);
    [updatedShipment] = await db
      .insert(shipmentOrders)
      .values({
        sellerId,
        orderId: actualOrderId,
        buyerId: orderRecord.buyerId,
        shippingPartnerId: matchedPartner.id,
        shippingMethodId: matchedMethod.id,
        shipmentNumber: `SHP-${cleanNum}`,
        awbNumber: `AWB-${cleanNum}`,
        trackingNumber: executiveData.trackingNumber,
        status: targetStatus,
        shippingCost: orderRecord.shippingCharge ? String(orderRecord.shippingCharge) : "0.00",
        codAmount: orderRecord.paymentMethod === "COD" ? String(orderRecord.grandTotal) : "0.00",
        notes: executiveNotesJson,
        shippedAt: dto.status === "OUT_FOR_DELIVERY" ? new Date() : null,
      })
      .returning();
  }

  // 4. Update order status if out for delivery or delivered
  if (dto.status === "OUT_FOR_DELIVERY") {
    await db
      .update(orders)
      .set({
        status: "OUT_FOR_DELIVERY",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, actualOrderId));

    await db.insert(orderStatusHistory).values({
      orderId: actualOrderId,
      sellerId,
      toStatus: "OUT_FOR_DELIVERY",
      action: "OUT_FOR_DELIVERY",
      source: "SELLER",
      result: "SUCCESS",
      remarks: `Assigned delivery executive: ${dto.executiveName} (${dto.executivePhone}) - Mode: ${dto.vehicleType}`,
    });

  } else if (dto.status === "DELIVERED") {
    await db
      .update(orders)
      .set({
        status: "DELIVERED",
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, actualOrderId));

    await db.insert(orderStatusHistory).values({
      orderId: actualOrderId,
      sellerId,
      toStatus: "DELIVERED",
      action: "DELIVERED",
      source: "SELLER",
      result: "SUCCESS",
      remarks: `Order delivered by executive: ${dto.executiveName}`,
    });
  } else {
    await db.insert(orderStatusHistory).values({
      orderId: actualOrderId,
      sellerId,
      toStatus: orderRecord.status,
      action: "UPDATED",
      source: "SELLER",
      result: "SUCCESS",
      remarks: `Assigned delivery executive: ${dto.executiveName} (${dto.executivePhone})`,
    });
  }

  return {
    shipment: updatedShipment,
    executive: executiveData,
  };
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


