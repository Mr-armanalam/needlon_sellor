import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { reviewsTable } from "@/db/schema/reviews";
import { productsTable } from "@/db/schema/catalog/products/table";
import { usersTable } from "@/db/schema/users";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import {
  customerMeasurementsTable,
  type CustomerMeasurementRecord,
} from "@/db/schema/customization/measurements";
import { type TailoringStage } from "@/db/schema/orders/constants";
import { type PaymentMethod } from "@/db/schema/orders/types";
import { fittingAppointmentsTable } from "@/db/schema/customization/fitting-appointments";
import { sellerCustomers } from "@/db/schema/seller/seller-customers";
import { chatPermissions } from "@/db/schema/messaging/chat-permissions";
import { notifications } from "@/db/schema/notifications/notification-events";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { createShipmentOrder } from "../../delivery/repository/delivery.repository";
import { and, desc, eq, isNull, or, sql, inArray } from "drizzle-orm";
import type { CreateWalkInCustomerDto } from "../dto/walk-in-customer.dto";
import type { CustomerItemResponseDto } from "../dto/customer.dto";
import type { RecordInStoreMeasurementInput } from "../dto/in-store-measurement.dto";
import type { CreateInStoreOrderDto, CreateInStoreOrderInput, UpdateTailoringStageDto } from "../dto/create-in-store-order.dto";
import type {
  ScheduleFittingAppointmentDto,
  UpdateFittingAppointmentDto,
  RecordHandoverDto,
} from "../dto/fitting-appointment.dto";

export async function getSellerCustomersData(sellerId: string, search?: string) {
  const orderConditions = [
    eq(orders.sellerId, sellerId),
    isNull(orders.deletedAt),
  ];

  if (search) {
    const term = `%${search}%`;
    orderConditions.push(
      sql`(${orders.buyerName} ILIKE ${term} OR ${orders.buyerEmail} ILIKE ${term} OR ${orders.buyerPhone} ILIKE ${term})`
    );
  }

  // 1. Order-based aggregates
  const orderRows = await db
    .select({
      buyerId: orders.buyerId,
      buyerName: sql<string>`MAX(${orders.buyerName})`,
      buyerEmail: sql<string>`MAX(${orders.buyerEmail})`,
      buyerPhone: sql<string>`MAX(${orders.buyerPhone})`,
      buyerAvatar: usersTable.imageUrl,
      totalOrders: sql<number>`COUNT(*)::int`,
      totalSpent: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      lastOrderAt: sql<Date>`MAX(${orders.createdAt})`,
    })
    .from(orders)
    .leftJoin(usersTable, eq(orders.buyerId, usersTable.id))
    .where(and(...orderConditions))
    .groupBy(orders.buyerId, usersTable.imageUrl)
    .orderBy(sql`MAX(${orders.createdAt}) DESC`);

  // 2. Walk-in enrolled customers from sellerCustomers
  const walkInConditions = [eq(sellerCustomers.sellerId, sellerId)];
  if (search) {
    const term = `%${search}%`;
    walkInConditions.push(
      sql`(${usersTable.name} ILIKE ${term} OR ${usersTable.email} ILIKE ${term} OR ${usersTable.number} ILIKE ${term})`
    );
  }

  const walkInRows = await db
    .select({
      buyerId: sellerCustomers.userId,
      buyerName: usersTable.name,
      buyerEmail: usersTable.email,
      buyerPhone: usersTable.number,
      buyerAvatar: usersTable.imageUrl,
      totalInStoreOrders: sellerCustomers.totalInStoreOrders,
      customerNotes: sellerCustomers.customerNotes,
      createdInStore: sellerCustomers.createdInStore,
      createdAt: sellerCustomers.createdAt,
    })
    .from(sellerCustomers)
    .innerJoin(usersTable, eq(sellerCustomers.userId, usersTable.id))
    .where(and(...walkInConditions))
    .orderBy(sql`${sellerCustomers.createdAt} DESC`);

  type SellerCustomerMapItem = CustomerItemResponseDto & {
    customerNotes?: string | null;
  };
  const customerMap = new Map<string, SellerCustomerMapItem>();

  for (const r of orderRows) {
    if (!r.buyerId) continue;
    customerMap.set(r.buyerId, {
      buyerId: r.buyerId,
      buyerName: r.buyerName || "Customer",
      buyerEmail: r.buyerEmail || "",
      buyerPhone: r.buyerPhone || null,
      buyerAvatar: r.buyerAvatar || null,
      totalOrders: r.totalOrders,
      totalSpent: parseFloat(r.totalSpent || "0").toFixed(2),
      lastOrderAt: r.lastOrderAt
        ? r.lastOrderAt instanceof Date
          ? r.lastOrderAt.toISOString()
          : new Date(r.lastOrderAt).toISOString()
        : new Date().toISOString(),
      isWalkIn: false,
    });
  }

  for (const w of walkInRows) {
    if (!w.buyerId) continue;
    const existing = customerMap.get(w.buyerId);
    if (existing) {
      existing.isWalkIn = true;
      existing.customerNotes = w.customerNotes;
      if (!existing.buyerPhone && w.buyerPhone) {
        existing.buyerPhone = w.buyerPhone;
      }
    } else {
      customerMap.set(w.buyerId, {
        buyerId: w.buyerId,
        buyerName: w.buyerName || "Customer",
        buyerEmail: w.buyerEmail || "",
        buyerPhone: w.buyerPhone || null,
        buyerAvatar: w.buyerAvatar || null,
        totalOrders: w.totalInStoreOrders || 0,
        totalSpent: "0.00",
        lastOrderAt: w.createdAt instanceof Date ? w.createdAt.toISOString() : new Date(w.createdAt).toISOString(),
        isWalkIn: true,
        customerNotes: w.customerNotes,
      });
    }
  }

  return Array.from(customerMap.values());
}

export async function getCustomerDetailsRepo(sellerId: string, buyerId: string) {
  const customerOrders = await db
    .select({
      id: orders.orderNumber,
      orderId: orders.id,
      date: orders.createdAt,
      total: orders.grandTotal,
      status: orders.status,
      tailoringStage: orders.tailoringStage,
      tailoringNotes: orders.tailoringNotes,
      source: orders.source,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), eq(orders.buyerId, buyerId), isNull(orders.deletedAt)))
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(10);

  const customerReviews = await db
    .select({
      id: reviewsTable.id,
      rating: reviewsTable.rating,
      comment: reviewsTable.content,
      date: reviewsTable.createdAt,
      productName: productsTable.name,
    })
    .from(reviewsTable)
    .leftJoin(productsTable, eq(reviewsTable.productId, productsTable.id))
    .where(and(eq(reviewsTable.sellerId, sellerId), eq(reviewsTable.buyerId, buyerId), isNull(reviewsTable.deletedAt)))
    .orderBy(sql`${reviewsTable.createdAt} DESC`)
    .limit(10);

  const orderIds = customerOrders.map((o) => o.orderId);
  const itemsForOrders =
    orderIds.length > 0
      ? await db
          .select({
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            variantName: orderItems.variantName,
            productName: orderItems.productName,
          })
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds))
      : [];

  type CustomerMeasurementRow = Pick<
    CustomerMeasurementRecord,
    | "id"
    | "orderId"
    | "orderItemId"
    | "productId"
    | "gender"
    | "garmentType"
    | "measurementUnit"
    | "essentialMeasurements"
    | "postureSpecifics"
    | "fitPreference"
    | "tailorNotes"
    | "source"
    | "status"
    | "isEditable"
    | "editRequested"
    | "editRequestReason"
    | "createdAt"
  > & { orderNumber: string | null };
  let measurements: CustomerMeasurementRow[] = [];
  try {
    measurements = await db
      .select({
        id: customerMeasurementsTable.id,
        orderId: customerMeasurementsTable.orderId,
        orderItemId: customerMeasurementsTable.orderItemId,
        productId: customerMeasurementsTable.productId,
        orderNumber: orders.orderNumber,
        gender: customerMeasurementsTable.gender,
        garmentType: customerMeasurementsTable.garmentType,
        measurementUnit: customerMeasurementsTable.measurementUnit,
        essentialMeasurements: customerMeasurementsTable.essentialMeasurements,
        postureSpecifics: customerMeasurementsTable.postureSpecifics,
        fitPreference: customerMeasurementsTable.fitPreference,
        tailorNotes: customerMeasurementsTable.tailorNotes,
        source: customerMeasurementsTable.source,
        status: customerMeasurementsTable.status,
        isEditable: customerMeasurementsTable.isEditable,
        editRequested: customerMeasurementsTable.editRequested,
        editRequestReason: customerMeasurementsTable.editRequestReason,
        createdAt: customerMeasurementsTable.createdAt,
      })
      .from(customerMeasurementsTable)
      .leftJoin(orders, eq(customerMeasurementsTable.orderId, orders.id))
      .where(
        and(
          orderIds.length > 0
            ? or(
                eq(customerMeasurementsTable.userId, buyerId),
                inArray(customerMeasurementsTable.orderId, orderIds)
              )
            : eq(customerMeasurementsTable.userId, buyerId),
          or(
            eq(customerMeasurementsTable.sellerId, sellerId),
            isNull(customerMeasurementsTable.sellerId)
          )
        )
      )
      .orderBy(sql`${customerMeasurementsTable.createdAt} DESC`)
      .limit(10);
  } catch (err) {
    console.warn("Could not fetch bespoke measurements for customer:", err);
  }
    
  return {
    history: customerOrders.map((o) => {
      const orderItemsList = itemsForOrders.filter((it) => it.orderId === o.orderId);
      const matchingMeasurement = measurements.find(
        (m) =>
          m.orderId === o.orderId ||
          (m.orderNumber && (m.orderNumber === o.id || m.orderNumber === o.orderId)) ||
          orderItemsList.some((it) => (m.productId && it.productId === m.productId) || (m.orderItemId && it.orderId === m.orderId))
      );
      const isBespoke = !!matchingMeasurement || !!o.tailoringStage;
      const sizeTag = orderItemsList[0]?.variantName || null;

      return {
        id: o.id,
        orderId: o.orderId,
        date: o.date ? new Date(o.date).toLocaleDateString() : "N/A",
        total: `₹${parseFloat(o.total || "0").toFixed(2)}`,
        status: o.status,
        tailoringStage: o.tailoringStage || null,
        tailoringNotes: o.tailoringNotes || null,
        source: o.source || "WEB",
        isBespoke,
        garmentType: matchingMeasurement?.garmentType || null,
        size: !isBespoke ? sizeTag || "Ready-to-Wear" : (sizeTag || "Custom Fit"),
      };
    }),
    reviews: customerReviews.map((r) => ({
      id: r.id,
      rating: r.rating || 5,
      comment: r.comment || "No comment provided.",
      product: r.productName || "Purchased Product",
      date: r.date ? new Date(r.date).toLocaleDateString() : "N/A",
    })),
    measurements: measurements.map((m) => {
      const matchedOrder = customerOrders.find((co) => {
        if (m.orderId && (m.orderId === co.orderId || m.orderId === co.id)) return true;
        if (m.orderNumber && (m.orderNumber === co.id || m.orderNumber === co.orderId)) return true;
        const oItems = itemsForOrders.filter((it) => it.orderId === co.orderId);
        return oItems.some((it) => m.productId && it.productId === m.productId);
      });

      return {
        id: m.id,
        orderId: m.orderId || matchedOrder?.orderId || null,
        orderNumber: m.orderNumber || matchedOrder?.id || (m.orderId ? `Order #${m.orderId.slice(-6)}` : null),
        gender: m.gender,
        garmentType: m.garmentType,
        unit: m.measurementUnit,
        essentialMeasurements: m.essentialMeasurements,
        postureSpecifics: m.postureSpecifics,
        fitPreference: m.fitPreference,
        tailorNotes: m.tailorNotes,
        source: m.source,
        status: m.status,
        isEditable: m.isEditable,
        editRequested: m.editRequested,
        editRequestReason: m.editRequestReason,
        date: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "N/A",
      };
    }),
  };
}

export async function allowCustomerMeasurementEditRepo(sellerId: string, measurementId: string) {
  const [existing] = await db
    .select()
    .from(customerMeasurementsTable)
    .where(eq(customerMeasurementsTable.id, measurementId))
    .limit(1);

  if (!existing) {
    throw new Error("Measurement record not found.");
  }

  const [updated] = await db
    .update(customerMeasurementsTable)
    .set({
      isEditable: true,
      updatedAt: new Date(),
    })
    .where(eq(customerMeasurementsTable.id, measurementId))
    .returning();

  return updated;
}

export async function createOrLinkWalkInCustomerRepo(sellerId: string, data: CreateWalkInCustomerDto) {
  const normalizedEmail = data.email.trim().toLowerCase();

  // 1. Look up existing user account by email
  const existingUsers = await db
    .select()
    .from(usersTable)
    .where(sql`LOWER(${usersTable.email}) = ${normalizedEmail}`)
    .limit(1);

  let userId: string;
  let isNewUser = false;

  if (existingUsers.length > 0) {
    const existing = existingUsers[0];
    userId = existing.id;
    // Update phone if missing
    if (!existing.number && data.phone) {
      await db
        .update(usersTable)
        .set({ number: data.phone.trim() })
        .where(eq(usersTable.id, userId));
    }
  } else {
    // 2. Provision new user account so customer can seamlessly log in later with same email
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: data.name.trim(),
        email: normalizedEmail,
        number: data.phone?.trim() || null,
        gender: data.gender || "male",
      })
      .returning();
    userId = newUser.id;
    isNewUser = true;
  }

  // 3. Link customer to this seller shop
  await db
    .insert(sellerCustomers)
    .values({
      sellerId,
      userId,
      customerNotes: data.notes?.trim() || null,
      createdInStore: true,
    })
    .onConflictDoUpdate({
      target: [sellerCustomers.sellerId, sellerCustomers.userId],
      set: {
        customerNotes: data.notes?.trim() || sql`${sellerCustomers.customerNotes}`,
        updatedAt: new Date(),
      },
    });

  return {
    userId,
    name: data.name.trim(),
    email: normalizedEmail,
    phone: data.phone?.trim() || null,
    isNewUser,
    createdInStore: true,
  };
}

export async function createInStoreMeasurementRepo(sellerId: string, data: RecordInStoreMeasurementInput) {
  // Fetch user information
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, data.userId))
    .limit(1);

  const [measurement] = await db
    .insert(customerMeasurementsTable)
    .values({
      userId: data.userId,
      sellerId,
      customerName: user?.name || "Customer",
      customerEmail: user?.email || null,
      customerPhone: user?.number || null,
      gender: data.gender,
      garmentType: data.garmentType,
      measurementUnit: data.measurementUnit || "INCHES",
      essentialMeasurements: data.essentialMeasurements,
      postureSpecifics: data.postureSpecifics || {},
      fitPreference: data.fitPreference || "REGULAR",
      tailorNotes: data.tailorNotes?.trim() || null,
      source: "IN_STORE_TAILOR_MASTER",
      status: "VERIFIED",
    })
    .returning();

  return measurement;
}

/**
 * Repository input: the current DTO shape, or the legacy shape where the
 * amount arrives as `estimatedAmount` instead of `amount`.
 */
export type CreateInStoreOrderRepoInput = Omit<CreateInStoreOrderInput, "amount"> & {
  amount?: number;
  estimatedAmount?: number;
};

export async function createInStoreOrderRepo(sellerId: string, data: CreateInStoreOrderRepoInput) {
  // 1. Fetch customer user record
  const [buyer] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, data.customerId))
    .limit(1);

  if (!buyer) {
    throw new Error("Customer user record not found");
  }

  // 2. Resolve or ensure seller store
  let [store] = await db
    .select()
    .from(sellerStore)
    .where(eq(sellerStore.sellerId, sellerId))
    .limit(1);

  if (!store) {
    [store] = await db
      .insert(sellerStore)
      .values({
        sellerId,
        storeName: "Tailor Atelier Shop",
        storeSlug: `atelier-${sellerId.slice(0, 8)}-${Date.now()}`,
      })
      .returning();
  }

  // 3. Resolve or ensure seller address
  let [address] = await db
    .select()
    .from(sellerAddresses)
    .where(eq(sellerAddresses.sellerId, sellerId))
    .limit(1);

  if (!address) {
    [address] = await db
      .insert(sellerAddresses)
      .values({
        sellerId,
        label: "Atelier Workshop",
        addressType: "SHOWROOM",
        addressLine1: "In-Store Workshop Counter",
        city: "Atelier City",
        state: "State",
        postalCode: "110001",
        countryCode: "IN",
      })
      .returning();
  }

  // 4. Resolve or ensure product reference
  let [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.storeId, sellerId))
    .limit(1);

  if (!product) {
    [product] = await db
      .select()
      .from(productsTable)
      .limit(1);
  }

  const orderNum = `BESPOKE-${Date.now().toString(36).toUpperCase()}`;
  // Legacy callers may send `estimatedAmount` instead of `amount`.
  const finalAmount = Number(data.amount ?? data.estimatedAmount ?? 0);
  const amountStr = finalAmount.toFixed(2);

  // Map DTO payment status to DB order_payment_status enum. An advance
  // payment below the full amount implies a partially-paid order unless the
  // caller stated a payment status explicitly.
  const advanceImpliesPartial =
    data.advancePaid != null && data.advancePaid < finalAmount && !data.paymentStatus;
  const mappedPaymentStatus =
    data.paymentStatus === "PARTIAL" || advanceImpliesPartial
      ? "PARTIALLY_PAID"
      : data.paymentStatus || "PAID";

  // Map the DTO payment method onto the DB `order_payment_method` enum
  // (in-store cash payments are recorded as COD).
  const paymentMethodMap: Record<CreateInStoreOrderDto["paymentMethod"], PaymentMethod> = {
    CASH: "COD",
    CARD: "CARD",
    UPI: "UPI",
    COD: "COD",
  };
  const mappedPaymentMethod: PaymentMethod =
    paymentMethodMap[data.paymentMethod ?? "CASH"] || "COD";

  const initialMediaUrls = Array.isArray(data.mediaUrls) && data.mediaUrls.length > 0
    ? data.mediaUrls
    : (data.imageUrl ? [data.imageUrl] : []);

  // 5. Insert order
  const isHomeDelivery = data.deliveryMethod === "HOME_DELIVERY";
  const [createdOrder] = await db
    .insert(orders)
    .values({
      sellerId,
      buyerId: data.customerId,
      storeId: store.id,
      shippingAddressId: address.id,
      orderNumber: orderNum,
      status: "CONFIRMED",
      tailoringStage: data.tailoringStage || "ORDER_PLACED",
      tailoringNotes: data.tailoringNotes || null,
      mediaUrls: initialMediaUrls,
      paymentStatus: mappedPaymentStatus,
      paymentMethod: mappedPaymentMethod,
      shippingMethod: isHomeDelivery ? "STANDARD" : "STORE_PICKUP",
      priority: "NORMAL",
      source: "IN_STORE",
      currency: "INR",
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.number || "+91 9999999999",
      subtotal: amountStr,
      grandTotal: amountStr,
    })
    .returning();

  // If customer asked for home delivery, record the delivery address snapshot & dispatch entry
  if (isHomeDelivery && data.shippingAddress) {
    try {
      await db.insert(orderAddresses).values({
        orderId: createdOrder.id,
        addressType: "DELIVERY",
        recipientName: data.shippingAddress.recipientName || buyer.name,
        phoneNumber: data.shippingAddress.phoneNumber || buyer.number || "+91 9999999999",
        addressLine1: data.shippingAddress.addressLine1,
        addressLine2: data.shippingAddress.addressLine2 || null,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postalCode: data.shippingAddress.postalCode,
        country: "India",
      });
    } catch (addrErr) {
      console.warn("Failed to insert order delivery address:", addrErr);
    }

    if (data.shippingPartnerId) {
      try {
        // Go through the canonical delivery path: it enforces order
        // ownership, resolves the partner's method, and applies the AWB
        // provenance rules (in-house shipments get a platform AWB; external
        // carriers must supply a real AWB — nothing is fabricated here).
        // When no AWB can be issued yet it throws, and the seller creates
        // the shipment from the dispatch flow instead.
        await createShipmentOrder(sellerId, {
          orderId: createdOrder.id,
          buyerId: data.customerId,
          shippingPartnerId: data.shippingPartnerId,
          shippingCost: 0,
          codAmount: 0,
          notes: "In-store bespoke commission booked for home delivery",
        });
      } catch (shpErr) {
        console.warn("Failed to create dispatch shipment order:", shpErr);
      }
    }
  }

  // 6. Insert order item snapshot
  if (product) {
    await db.insert(orderItems).values({
      orderId: createdOrder.id,
      sellerId,
      productId: product.id,
      sku: orderNum,
      productSlug: data.garmentName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      productName: data.garmentName,
      imageUrl: data.imageUrl || (initialMediaUrls[0] || null),
      thumbnailUrl: data.imageUrl || (initialMediaUrls[0] || null),
      unitPrice: amountStr,
      quantity: 1,
      subtotal: amountStr,
      total: amountStr,
    });
  }

  // 7. Insert status history audit
  await db.insert(orderStatusHistory).values({
    orderId: createdOrder.id,
    sellerId,
    toStatus: "CONFIRMED",
    action: "CREATED",
    remarks: data.tailoringNotes || "In-store bespoke commission accepted by master tailor.",
  });

  // 8. If measurementId provided, associate measurement with order
  if (data.measurementId) {
    await db
      .update(customerMeasurementsTable)
      .set({ orderId: createdOrder.id })
      .where(eq(customerMeasurementsTable.id, data.measurementId));
  }

  // 9. Increment in-store order count
  await db
    .update(sellerCustomers)
    .set({
      totalInStoreOrders: sql`${sellerCustomers.totalInStoreOrders} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(sellerCustomers.sellerId, sellerId),
        eq(sellerCustomers.userId, data.customerId)
      )
    );

  // 10. Dispatch real-time in-app notification to customer personal account
  try {
    await db.insert(notifications).values({
      recipientType: "BUYER",
      recipientId: data.customerId,
      notificationType: "NEW_ORDER",
      title: `Bespoke Order Confirmed: ${orderNum}`,
      message: `Your bespoke garment commission "${data.garmentName}" has been accepted at the tailor atelier. Track live tailoring milestones in your account.`,
      referenceType: "ORDER",
      referenceId: createdOrder.id,
      priority: "HIGH",
      isRead: false,
    });
  } catch (err) {
    console.warn("Failed to dispatch in-store order notification to buyer:", err);
  }

  return createdOrder;
}

export async function updateTailoringStageRepo(
  sellerId: string,
  orderId: string,
  data: UpdateTailoringStageDto
) {
  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId)))
    .limit(1);

  if (!existingOrder) {
    throw new Error("Order not found or unauthorized");
  }

  let newOrderStatus = existingOrder.status;
  if (data.stage === "COMPLETED") {
    newOrderStatus = "COMPLETED";
  } else if (data.stage === "READY_FOR_PICKUP") {
    newOrderStatus = "CONFIRMED";
  }

  const [updated] = await db
    .update(orders)
    .set({
      tailoringStage: data.stage,
      tailoringNotes: data.notes || existingOrder.tailoringNotes,
      status: newOrderStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  await db.insert(orderStatusHistory).values({
    orderId,
    sellerId,
    fromStatus: existingOrder.status,
    toStatus: newOrderStatus,
    action: "UPDATED",
    remarks: data.notes || `Bespoke tailoring stage advanced to ${data.stage}`,
  });

  // Dispatch real-time tailoring milestone progress notification to customer
  if (existingOrder.buyerId) {
    try {
      const stageLabels: Record<string, string> = {
        ORDER_PLACED: "Order Placed",
        MEASUREMENT_VERIFIED: "Measurements Verified",
        PATTERN_DRAFTING: "Pattern Drafting",
        IN_CUTTING: "Fabric In Cutting",
        TRIAL_FITTING: "Trial Fitting Scheduled",
        FINAL_STITCH: "Final Stitching & Sewing",
        QUALITY_INSPECTION: "Quality Inspection",
        READY_FOR_PICKUP: "Ready For Pickup / Dispatch",
        COMPLETED: "Tailoring Completed",
      };
      const stageDisplay = stageLabels[data.stage] || data.stage.replace(/_/g, " ");

      await db.insert(notifications).values({
        recipientType: "BUYER",
        recipientId: existingOrder.buyerId,
        notificationType: "ORDER_STATUS",
        title: `Tailoring Update: ${stageDisplay}`,
        message: data.notes
          ? `Your bespoke order ${existingOrder.orderNumber} reached ${stageDisplay}. Tailor Note: ${data.notes}`
          : `Your bespoke order ${existingOrder.orderNumber} has progressed to ${stageDisplay}.`,
        referenceType: "ORDER",
        referenceId: orderId,
        priority: "HIGH",
        isRead: false,
      });
    } catch (err) {
      console.warn("Failed to dispatch tailoring stage notification to buyer:", err);
    }
  }

  return updated;
}

export async function getChatPermissionRepo(sellerId: string, buyerId: string) {
  const [record] = await db
    .select()
    .from(chatPermissions)
    .where(
      and(
        eq(chatPermissions.sellerId, sellerId),
        eq(chatPermissions.buyerId, buyerId)
      )
    )
    .limit(1);

  if (!record) {
    return {
      status: "NOT_REQUESTED",
      isEnabled: true,
      canMessage: false,
    };
  }

  return {
    id: record.id,
    status: record.status,
    isEnabled: record.isEnabled,
    requestMessage: record.requestMessage,
    requestedAt: record.requestedAt,
    respondedAt: record.respondedAt,
    canMessage: record.status === "ACCEPTED" && record.isEnabled === true,
  };
}

export async function requestChatPermissionRepo(
  sellerId: string,
  buyerId: string,
  message?: string
) {
  const [upserted] = await db
    .insert(chatPermissions)
    .values({
      sellerId,
      buyerId,
      status: "REQUESTED",
      isEnabled: true,
      requestMessage: message?.trim() || "Tailor shop requested to connect for garment fitting & order updates.",
      requestedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [chatPermissions.sellerId, chatPermissions.buyerId],
      set: {
        status: "REQUESTED",
        requestMessage: message?.trim() || sql`${chatPermissions.requestMessage}`,
        requestedAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning();

  return upserted;
}

export async function respondChatPermissionRepo(
  buyerId: string,
  sellerId: string,
  status: "ACCEPTED" | "DECLINED"
) {
  const [updated] = await db
    .update(chatPermissions)
    .set({
      status,
      isEnabled: status === "ACCEPTED",
      respondedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatPermissions.buyerId, buyerId),
        eq(chatPermissions.sellerId, sellerId)
      )
    )
    .returning();

  return updated;
}

export async function toggleChatPermissionRepo(
  buyerId: string,
  sellerId: string,
  isEnabled: boolean
) {
  const [updated] = await db
    .update(chatPermissions)
    .set({
      isEnabled,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatPermissions.buyerId, buyerId),
        eq(chatPermissions.sellerId, sellerId)
      )
    )
    .returning();

  return updated;
}

export async function canSellerMessageCustomerRepo(
  sellerId: string,
  buyerId: string
): Promise<boolean> {
  const perm = await getChatPermissionRepo(sellerId, buyerId);
  return Boolean(perm.canMessage);
}

export async function scheduleFittingAppointmentRepo(
  sellerId: string,
  data: ScheduleFittingAppointmentDto
) {
  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, data.orderId), eq(orders.sellerId, sellerId)))
    .limit(1);

  if (!existingOrder) {
    throw new Error("Order not found or unauthorized");
  }

  const parsedDate = new Date(data.scheduledAt);

  const [appointment] = await db
    .insert(fittingAppointmentsTable)
    .values({
      orderId: data.orderId,
      sellerId,
      customerId: data.customerId,
      scheduledAt: parsedDate,
      durationMinutes: data.durationMinutes || 30,
      status: "SCHEDULED",
      fittingNotes: data.fittingNotes || null,
      tailorMasterName: data.tailorMasterName || "Master Tailor",
    })
    .returning();

  // Advance order tailoring milestone to TRIAL_FITTING
  await db
    .update(orders)
    .set({
      tailoringStage: "TRIAL_FITTING",
      tailoringNotes: data.fittingNotes || `Trial fitting scheduled for ${parsedDate.toLocaleString()}`,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, data.orderId));

  await db.insert(orderStatusHistory).values({
    orderId: data.orderId,
    sellerId,
    fromStatus: existingOrder.status,
    toStatus: existingOrder.status,
    action: "UPDATED",
    remarks: `In-store trial fitting booked for ${parsedDate.toLocaleString()}`,
  });

  // Dispatch buyer notification
  try {
    await db.insert(notifications).values({
      recipientType: "BUYER",
      recipientId: data.customerId,
      notificationType: "ORDER_STATUS",
      title: "In-Store Trial Fitting Scheduled",
      message: `Your trial fitting session for order ${existingOrder.orderNumber} is booked for ${parsedDate.toLocaleString()}. Master Tailor: ${data.tailorMasterName || "Atelier Master"}.`,
      referenceType: "ORDER",
      referenceId: data.orderId,
      priority: "HIGH",
      isRead: false,
    });
  } catch (err) {
    console.warn("Failed to dispatch fitting schedule notification:", err);
  }

  return appointment;
}

export async function getFittingAppointmentsRepo(
  sellerId: string,
  orderId?: string,
  customerId?: string
) {
  const conditions = [eq(fittingAppointmentsTable.sellerId, sellerId)];
  if (orderId) conditions.push(eq(fittingAppointmentsTable.orderId, orderId));
  if (customerId) conditions.push(eq(fittingAppointmentsTable.customerId, customerId));

  const list = await db
    .select({
      id: fittingAppointmentsTable.id,
      orderId: fittingAppointmentsTable.orderId,
      sellerId: fittingAppointmentsTable.sellerId,
      customerId: fittingAppointmentsTable.customerId,
      scheduledAt: fittingAppointmentsTable.scheduledAt,
      durationMinutes: fittingAppointmentsTable.durationMinutes,
      status: fittingAppointmentsTable.status,
      fittingNotes: fittingAppointmentsTable.fittingNotes,
      alterationsRequired: fittingAppointmentsTable.alterationsRequired,
      alterationDetails: fittingAppointmentsTable.alterationDetails,
      tailorMasterName: fittingAppointmentsTable.tailorMasterName,
      completedAt: fittingAppointmentsTable.completedAt,
      createdAt: fittingAppointmentsTable.createdAt,
      orderNumber: orders.orderNumber,
      buyerName: orders.buyerName,
    })
    .from(fittingAppointmentsTable)
    .leftJoin(orders, eq(fittingAppointmentsTable.orderId, orders.id))
    .where(and(...conditions))
    .orderBy(desc(fittingAppointmentsTable.scheduledAt));

  return list;
}

export async function updateFittingAppointmentRepo(
  sellerId: string,
  appointmentId: string,
  data: UpdateFittingAppointmentDto
) {
  const [existing] = await db
    .select()
    .from(fittingAppointmentsTable)
    .where(
      and(
        eq(fittingAppointmentsTable.id, appointmentId),
        eq(fittingAppointmentsTable.sellerId, sellerId)
      )
    )
    .limit(1);

  if (!existing) {
    throw new Error("Fitting appointment not found or unauthorized");
  }

  const [updated] = await db
    .update(fittingAppointmentsTable)
    .set({
      status: data.status,
      fittingNotes: data.fittingNotes || existing.fittingNotes,
      alterationsRequired: data.alterationsRequired,
      alterationDetails: data.alterationDetails || null,
      completedAt: data.status === "COMPLETED" ? new Date() : existing.completedAt,
      updatedAt: new Date(),
    })
    .where(eq(fittingAppointmentsTable.id, appointmentId))
    .returning();

  // If advanceTailoringStage is requested:
  if (data.advanceTailoringStage) {
    const nextStage: TailoringStage = data.alterationsRequired ? "IN_CUTTING" : "FINAL_STITCH";
    const nextNotes = data.alterationsRequired
      ? `Alteration adjustments: ${data.alterationDetails || "Adjustment noted during fitting."}`
      : "Trial fitting approved by client. Proceeding to final stitch & hand-finishing.";

    await updateTailoringStageRepo(sellerId, existing.orderId, {
      stage: nextStage,
      notes: nextNotes,
    });
  }

  return updated;
}

export async function recordInStoreHandoverRepo(
  sellerId: string,
  orderId: string,
  data?: RecordHandoverDto
) {
  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId)))
    .limit(1);

  if (!existingOrder) {
    throw new Error("Order not found or unauthorized");
  }

  const [updated] = await db
    .update(orders)
    .set({
      status: "COMPLETED",
      tailoringStage: "COMPLETED",
      tailoringNotes: data?.handoverNotes || "Garment collected by client in atelier. Handover completed.",
      paymentStatus: data?.markPaid !== false ? "PAID" : existingOrder.paymentStatus,
      deliveredAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  await db.insert(orderStatusHistory).values({
    orderId,
    sellerId,
    fromStatus: existingOrder.status,
    toStatus: "COMPLETED",
    action: "DELIVERED",
    remarks: data?.handoverNotes || "Bespoke commission in-store handover completed.",
  });

  if (existingOrder.buyerId) {
    try {
      await db.insert(notifications).values({
        recipientType: "BUYER",
        recipientId: existingOrder.buyerId,
        notificationType: "ORDER_STATUS",
        title: "Bespoke Garment Handover Completed",
        message: `Your bespoke garment for order ${existingOrder.orderNumber} has been handed over. Thank you for commissioning with our atelier!`,
        referenceType: "ORDER",
        referenceId: orderId,
        priority: "NORMAL",
        isRead: false,
      });
    } catch (err) {
      console.warn("Failed to dispatch handover notification:", err);
    }
  }

  return updated;
}

export async function addOrderMediaRepo(
  sellerId: string,
  orderId: string,
  mediaUrl: string,
  caption?: string
) {
  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId)))
    .limit(1);

  if (!existingOrder) {
    throw new Error("Order not found or unauthorized");
  }

  const currentMediaUrls: string[] = Array.isArray(existingOrder.mediaUrls) ? [...existingOrder.mediaUrls] : [];
  if (!currentMediaUrls.includes(mediaUrl)) {
    currentMediaUrls.push(mediaUrl);
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      mediaUrls: currentMediaUrls,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  // Also update primary image on orderItems if empty
  const [firstItem] = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .limit(1);

  if (firstItem && (!firstItem.imageUrl || firstItem.imageUrl.trim() === "")) {
    await db
      .update(orderItems)
      .set({
        imageUrl: mediaUrl,
        thumbnailUrl: mediaUrl,
        updatedAt: new Date(),
      })
      .where(eq(orderItems.id, firstItem.id));
  }

  // Audit history
  await db.insert(orderStatusHistory).values({
    orderId,
    sellerId,
    fromStatus: existingOrder.status,
    toStatus: existingOrder.status,
    action: "UPDATED",
    remarks: caption || "Added garment craft progress media (photo/video)",
  });

  // Notify buyer of craft progress
  if (existingOrder.buyerId) {
    try {
      await db.insert(notifications).values({
        recipientType: "BUYER",
        recipientId: existingOrder.buyerId,
        notificationType: "ORDER_STATUS",
        title: "Craft Progress Media Added",
        message: `Master tailor added craft progress photos/video for your order ${existingOrder.orderNumber}. View live updates in your account!`,
        referenceType: "ORDER",
        referenceId: orderId,
        priority: "NORMAL",
        isRead: false,
      });
    } catch (err) {
      console.warn("Failed to dispatch craft media notification:", err);
    }
  }

  return { success: true, mediaUrls: currentMediaUrls, order: updatedOrder };
}


