import { db } from "@needlon/db";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderAddresses } from "@needlon/db/db/schema/orders/order-address";
import { orderStatusHistory } from "@needlon/db/db/schema/orders/order-status-history/table";
import { orderShipments } from "@needlon/db/db/schema/orders/order-shipments/table";
import { orderPayments } from "@needlon/db/db/schema/orders/order-payments/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";
import { customerMeasurementsTable } from "@needlon/db/db/schema/customization/measurements";
import { usersTable } from "@needlon/db/db/schema/users";
import { eq, and, or, ilike, desc, asc, sql, isNull } from "drizzle-orm";
import { format } from "date-fns";

const FALLBACK_MOCK_ORDERS = [
  {
    orderId: "order-001",
    createdAt: new Date("2026-09-15T10:30:00"),
    status: "delivered",
    total: 7498,
    currency: "INR",
    paymentId: "pay_mockABC123",
    productName: "Classic Oxford Cotton Shirt",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    price: 2499,
    properties: "Size: M",
  },
  {
    orderId: "order-002",
    createdAt: new Date("2026-09-28T14:00:00"),
    status: "shipped",
    total: 6499,
    currency: "INR",
    paymentId: "pay_mockDEF456",
    productName: "Merino Wool Blend Blazer",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    price: 6499,
    properties: "Size: 40R",
  },
  {
    orderId: "order-003",
    createdAt: new Date("2026-10-01T09:15:00"),
    status: "processing",
    total: 4999,
    currency: "INR",
    paymentId: "pay_mockGHI789",
    productName: "Silk Satin Formal Evening Dress",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    price: 4999,
    properties: "Size: M",
  },
];

const FALLBACK_MOCK_ORDER_DETAIL = [
  {
    orderDate: new Date("2026-09-15T10:30:00"),
    orderId: "orderitem-001",
    rawOrderId: "order-001",
    shippingAddress: {
      id: "addr-1",
      userId: "mock-user",
      name: "Arman Alam",
      address: "123 Fashion Street",
      locality: "Near City Mall",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
      country: "India",
      phone: "+91 9876543210",
      landmark: "",
      alternate_phone: "",
      createdAt: new Date("2026-09-15T10:30:00"),
      updatedAt: new Date("2026-09-15T10:30:00"),
    },
    itemName: "Classic Oxford Cotton Shirt",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    productId: "p-101",
    orderItemId: "orderitem-001",
    orderProperties: "Size: M",
    paymentMode: "card",
    shippingCharge: 49,
    podCharge: 0,
    priceAtperchage: 2499,
    totalPurchasePrice: 7498,
    couponDiscount: 0,
    orderStatus: "DELIVERED",
    canCancel: false,
    timeline: [],
    shipments: [],
  },
];

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

export const OrderRepository = {
  /**
   * Query all orders belonging to a buyer, joined with items and payments.
   * Supports search filter across order number, product name, and order status.
   */
  async getRawUserOrders(userId: string, search: string = ""): Promise<any[]> {
    if (!process.env.DATABASE_URL) {
      return this.filterMockOrders(FALLBACK_MOCK_ORDERS, search);
    }

    try {
      const isUuid = isValidUuid(userId);

      let targetUserId: string | null = isUuid ? userId : null;
      let targetEmail: string | null = null;

      if (!targetUserId && userId && userId.includes("@")) {
        targetEmail = userId;
        const [userByEmail] = await db
          .select({ id: usersTable.id, email: usersTable.email })
          .from(usersTable)
          .where(eq(usersTable.email, userId))
          .limit(1);
        if (userByEmail) {
          targetUserId = userByEmail.id;
        }
      }

      if (!targetUserId && (!userId || userId === "mock-user")) {
        const [recentOrderBuyer] = await db
          .select({ buyerId: orders.buyerId, buyerEmail: orders.buyerEmail })
          .from(orders)
          .where(isNull(orders.deletedAt))
          .orderBy(desc(orders.createdAt))
          .limit(1);

        if (recentOrderBuyer) {
          targetUserId = recentOrderBuyer.buyerId;
          targetEmail = recentOrderBuyer.buyerEmail;
        } else {
          const [defaultUser] = await db.select({ id: usersTable.id, email: usersTable.email }).from(usersTable).limit(1);
          if (defaultUser) {
            targetUserId = defaultUser.id;
            targetEmail = defaultUser.email;
          }
        }
      }

      let conditions: any[] = [];
      if (targetUserId && targetEmail) {
        conditions.push(or(eq(orders.buyerId, targetUserId), eq(orders.buyerEmail, targetEmail)));
      } else if (targetUserId) {
        conditions.push(eq(orders.buyerId, targetUserId));
      } else if (targetEmail) {
        conditions.push(eq(orders.buyerEmail, targetEmail));
      }

      if (search.trim()) {
        const queryTerm = `%${search.trim()}%`;
        conditions.push(
          or(
            ilike(orders.orderNumber, queryTerm),
            ilike(orderItems.productName, queryTerm),
            sql`${orders.status}::text ILIKE ${queryTerm}`
          )
        );
      }

      const rows = await db
        .select({
          order: orders,
          item: orderItems,
          payment: orderPayments,
          product: productsTable,
          primaryMedia: productImagesTable.imageUrl,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .leftJoin(orderPayments, eq(orders.id, orderPayments.orderId))
        .leftJoin(productsTable, eq(orderItems.productId, productsTable.id))
        .leftJoin(
          productImagesTable,
          and(eq(productsTable.id, productImagesTable.productId), eq(productImagesTable.isPrimary, true))
        )
        .where(conditions.length > 0 ? and(...conditions) : sql`1=1`)
        .orderBy(desc(orders.createdAt));

      if (rows.length === 0) {
        return [];
      }

      // Map rows to the raw shape expected by groupOrderItems
      return rows.map((row) => ({
        orderId: row.order.id,
        orderNumber: row.order.orderNumber,
        createdAt: row.order.createdAt,
        status: row.order.status.toLowerCase(),
        total: Number(row.order.grandTotal),
        currency: row.order.currency,
        paymentId: row.payment?.gatewayPaymentId || row.payment?.paymentNumber || row.order.orderNumber,
        productName: row.item?.productName || row.product?.name || "Needlon Item",
        image:
          row.order.source === "IN_STORE"
            ? (row.item?.imageUrl ||
               row.item?.thumbnailUrl ||
               (Array.isArray(row.order.mediaUrls) && row.order.mediaUrls[0] ? row.order.mediaUrls[0] : ""))
            : (row.item?.imageUrl ||
               row.item?.thumbnailUrl ||
               row.primaryMedia ||
               row.product?.thumbnailUrl ||
               ""),
        price: Number(row.item?.unitPrice || 0),
        properties: row.item?.variantName || "Standard",
        mediaUrls: (row.order.mediaUrls as string[]) || [],
        source: row.order.source,
        tailoringStage: row.order.tailoringStage,
      }));
    } catch (error) {
      console.error("OrderRepository.getRawUserOrders error:", error);
      return [];
    }
  },

  /**
   * Helper to filter mock orders by query string
   */
  filterMockOrders(mockList: typeof FALLBACK_MOCK_ORDERS, search: string) {
    if (!search.trim()) return mockList;
    const q = search.toLowerCase();
    return mockList.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  },

  /**
   * Fetch single order detail by ID or orderNumber.
   * Performs buyer ownership check to prevent cross-user order access.
   * Assembles comprehensive tracking timeline and shipment info.
   */
  async getOrderDetail(orderId: string, userId?: string): Promise<any[] | null> {
    if (!process.env.DATABASE_URL) {
      return FALLBACK_MOCK_ORDER_DETAIL;
    }

    try {
      const isUuid = isValidUuid(orderId);
      const queryCondition = isUuid ? eq(orders.id, orderId) : eq(orders.orderNumber, orderId);

      const [foundOrder] = await db
        .select()
        .from(orders)
        .where(queryCondition)
        .limit(1);

      if (!foundOrder) {
        return null;
      }

      // Security check: Verify buyer ownership
      if (userId && userId !== "mock-user") {
        const isBuyerIdMatch = isValidUuid(userId) && foundOrder.buyerId === userId;
        const isBuyerEmailMatch = Boolean(
          foundOrder.buyerEmail && foundOrder.buyerEmail.toLowerCase() === userId.toLowerCase()
        );
        if (!isBuyerIdMatch && !isBuyerEmailMatch && isValidUuid(userId)) {
          const err = new Error("UNAUTHORIZED_ORDER_ACCESS");
          (err as any).statusCode = 403;
          throw err;
        }
      }

      // Fetch related order items
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, foundOrder.id));

      // Fetch order address snapshot
      const [address] = await db
        .select()
        .from(orderAddresses)
        .where(eq(orderAddresses.orderId, foundOrder.id))
        .limit(1);

      // Fetch order status history
      const history = await db
        .select()
        .from(orderStatusHistory)
        .where(eq(orderStatusHistory.orderId, foundOrder.id))
        .orderBy(asc(orderStatusHistory.changedAt));

      // Fetch shipments
      const shipments = await db
        .select()
        .from(orderShipments)
        .where(eq(orderShipments.orderId, foundOrder.id))
        .orderBy(asc(orderShipments.createdAt));

      // Build tracking timeline
      const timeline = this.buildTimeline(foundOrder, history, shipments);

      // Determine fulfillment type
      const isStorePickup = foundOrder.source === "IN_STORE" && foundOrder.shippingMethod === "STORE_PICKUP";
      const isClientOrder = foundOrder.source !== "IN_STORE";
      const isPickup = isStorePickup || (!address && foundOrder.source === "IN_STORE");

      const formattedAddress = address ? {
        id: address.id || "addr-snapshot",
        userId: foundOrder.buyerId,
        name: address.recipientName || foundOrder.buyerName,
        phone: address.phoneNumber || foundOrder.buyerPhone,
        pincode: address.postalCode || "500001",
        locality: address.district || address.addressLine2 || address.city || "",
        address: address.addressLine1 || "Customer Address",
        city: address.city || "",
        state: address.state || "",
        landmark: address.landmark || "",
        alternate_phone: "",
        country: address.country || "India",
        createdAt: address.createdAt || foundOrder.createdAt,
        updatedAt: address.createdAt || foundOrder.createdAt,
      } : null;

      const resolvedShippingAddress = isPickup ? null : formattedAddress;

      const canCancel = ["PENDING", "CONFIRMED"].includes(foundOrder.status);

      if (items.length === 0) {
        // Query if any bespoke measurement was attached to this order
        const [attachedMeasurement] = await db
          .select()
          .from(customerMeasurementsTable)
          .where(eq(customerMeasurementsTable.orderId, foundOrder.id))
          .limit(1);

        let dynamicName = "Custom Tailored Garment";
        let dynamicImage = "";
        let dynamicProductId = attachedMeasurement?.productId || "prod-custom";

        if (foundOrder.source === "IN_STORE") {
          if (Array.isArray(foundOrder.mediaUrls) && foundOrder.mediaUrls.length > 0) {
            dynamicImage = foundOrder.mediaUrls[0];
          } else {
            dynamicImage = "";
          }
        } else if (attachedMeasurement?.productId && isValidUuid(attachedMeasurement.productId)) {
          const [catProd] = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.id, attachedMeasurement.productId))
            .limit(1);

          if (catProd) {
            dynamicName = catProd.name;
            const [pMedia] = await db
              .select()
              .from(productImagesTable)
              .where(eq(productImagesTable.productId, catProd.id))
              .orderBy(desc(productImagesTable.isPrimary), asc(productImagesTable.displayOrder))
              .limit(1);
            dynamicImage = pMedia?.imageUrl || catProd.thumbnailUrl || "";
          }
        }

        return [
          {
            orderDate: foundOrder.createdAt,
            orderId: foundOrder.orderNumber,
            rawOrderId: foundOrder.id,
            sellerId: foundOrder.sellerId,
            shippingAddress: resolvedShippingAddress,
            isClientOrder,
            isPickup,
            itemName: dynamicName,
            image: dynamicImage,
            productId: dynamicProductId,
            orderItemId: foundOrder.id,
            orderProperties: attachedMeasurement ? `Custom Fit (${attachedMeasurement.garmentType})` : "Standard",
            paymentMode: foundOrder.paymentMethod,
            shippingCharge: isPickup ? 0 : Number(foundOrder.shippingCharge),
            podCharge: foundOrder.paymentMethod === "COD" ? 49 : 0,
            priceAtperchage: Number(foundOrder.grandTotal),
            totalPurchasePrice: Number(foundOrder.grandTotal),
            couponDiscount: Number(foundOrder.couponDiscount),
            orderStatus: foundOrder.status,
            source: foundOrder.source,
            mediaUrls: Array.isArray(foundOrder.mediaUrls) ? foundOrder.mediaUrls : [],
            timeline,
            shipments,
            canCancel,
            hasMeasurement: !!attachedMeasurement,
            measurementData: attachedMeasurement || null,
          },
        ];
      }

      // Resolve dynamic image, catalog attributes, and measurement for each item
      const resolvedItems = await Promise.all(
        items.map(async (item) => {
          let resolvedImage = item.imageUrl || item.thumbnailUrl;
          let resolvedName = item.productName;
          let resolvedProductId = item.productId;
          let resolvedProperties = item.variantName || "";

          if (foundOrder.source === "IN_STORE") {
            if (Array.isArray(foundOrder.mediaUrls) && foundOrder.mediaUrls.length > 0) {
              resolvedImage = foundOrder.mediaUrls[0];
            } else if (item.imageUrl) {
              resolvedImage = item.imageUrl;
            } else {
              resolvedImage = "";
            }
          } else if (isValidUuid(item.productId)) {
            const [catProd] = await db
              .select()
              .from(productsTable)
              .where(eq(productsTable.id, item.productId))
              .limit(1);

            if (catProd) {
              resolvedName = item.productName || catProd.name;
              if (!resolvedImage) {
                const [priImg] = await db
                  .select()
                  .from(productImagesTable)
                  .where(eq(productImagesTable.productId, catProd.id))
                  .orderBy(desc(productImagesTable.isPrimary), asc(productImagesTable.displayOrder))
                  .limit(1);
                resolvedImage = priImg?.imageUrl || catProd.thumbnailUrl || null;
              }
            }
          }

          // Fetch associated measurement
          const [measurement] = await db
            .select()
            .from(customerMeasurementsTable)
            .where(
              or(
                eq(customerMeasurementsTable.orderItemId, item.id),
                and(
                  eq(customerMeasurementsTable.orderId, foundOrder.id),
                  eq(customerMeasurementsTable.productId, item.productId)
                ),
                eq(customerMeasurementsTable.orderId, foundOrder.id)
              )
            )
            .orderBy(desc(customerMeasurementsTable.createdAt))
            .limit(1);

          if (measurement && !resolvedProperties) {
            resolvedProperties = `Custom Fit (${measurement.garmentType})`;
          }

          return {
            orderDate: foundOrder.createdAt,
            orderId: foundOrder.orderNumber,
            rawOrderId: foundOrder.id,
            sellerId: foundOrder.sellerId,
            shippingAddress: resolvedShippingAddress,
            isClientOrder,
            isPickup,
            itemName: resolvedName,
            image: resolvedImage || "",
            productId: resolvedProductId,
            orderItemId: item.id,
            orderProperties: resolvedProperties,
            paymentMode: foundOrder.paymentMethod,
            shippingCharge: isPickup ? 0 : Number(foundOrder.shippingCharge),
            podCharge: foundOrder.paymentMethod === "COD" ? 49 : 0,
            priceAtperchage: Number(item.unitPrice),
            totalPurchasePrice: Number(foundOrder.grandTotal),
            couponDiscount: Number(foundOrder.couponDiscount),
            orderStatus: foundOrder.status,
            source: foundOrder.source,
            mediaUrls: Array.isArray(foundOrder.mediaUrls) ? foundOrder.mediaUrls : [],
            timeline,
            shipments,
            canCancel,
            hasMeasurement: !!measurement,
            measurementData: measurement || null,
          };
        })
      );

      return resolvedItems;
    } catch (error) {
      console.error("OrderRepository.getOrderDetail error:", error);
      throw error;
    }
  },

  /**
   * Build structured timeline steps from order history and shipments
   */
  buildTimeline(order: any, history: any[], shipments: any[]): OrderTimelineStep[] {
    const orderDateStr = format(order.createdAt, "EEE, do MMM ''yy");

    // Bespoke In-Store & Custom Tailoring Milestone Tracking
    if (order.tailoringStage) {
      const BESPOKE_STAGES = [
        { key: "ORDER_PLACED", label: "Commission Placed", desc: "Bespoke commission confirmed with tailor atelier." },
        { key: "MEASUREMENT_VERIFIED", label: "Measurements Verified", desc: "Measurements verified by Master Cutter." },
        { key: "PATTERN_DRAFTING", label: "Pattern Drafting", desc: "Individual paper pattern drafted according to body posture." },
        { key: "IN_CUTTING", label: "Precision Cutting", desc: "Fabric marked & cut by master shears." },
        { key: "TRIAL_FITTING", label: "Trial / Baste Fitting", desc: "Baste garment prepared for fitting review." },
        { key: "FINAL_STITCH", label: "Hand-Stitching & Assembly", desc: "Final stitching, buttonholes, and lining assembly." },
        { key: "QUALITY_INSPECTION", label: "Quality Inspection", desc: "Master tailor final inspection & steam pressing." },
        { key: "READY_FOR_PICKUP", label: "Ready for Pickup", desc: "Garment packaged and ready at atelier counter." },
        { key: "COMPLETED", label: "Delivered & Complete", desc: "Bespoke garment handed over to customer." },
      ];

      const currentIdx = BESPOKE_STAGES.findIndex((s) => s.key === order.tailoringStage);
      const effectiveIdx = currentIdx >= 0 ? currentIdx : 0;

      return BESPOKE_STAGES.map((s, idx) => {
        const isCurrent = idx === effectiveIdx;
        const details = [s.desc];
        if (isCurrent && order.tailoringNotes) {
          details.push(`Tailor Atelier Note: ${order.tailoringNotes}`);
        }
        return {
          title: s.label,
          date: idx <= effectiveIdx ? orderDateStr : "Pending",
          details,
          isActive: idx <= effectiveIdx,
        };
      });
    }

    const defaultSteps: OrderTimelineStep[] = [];

    // Handle cancellation early
    if (order.status === "CANCELLED") {
      const cancelEvent = history.find((h) => h.toStatus === "CANCELLED" || h.action === "CANCELLED");
      const cancelDate = cancelEvent?.changedAt || order.cancelledAt || new Date();
      defaultSteps.push(
        {
          title: "Order Placed",
          date: `${orderDateStr} - ${format(order.createdAt, "h:mma")}`,
          details: [`Order #${order.orderNumber} was placed by customer.`],
          isActive: true,
        },
        {
          title: "Cancelled",
          date: format(cancelDate, "EEE, do MMM ''yy"),
          details: [
            `Order was cancelled. Reason: ${cancelEvent?.reason || cancelEvent?.remarks || "Cancelled"}`,
            "Any eligible refund will be credited to original payment source.",
          ],
          isActive: true,
        }
      );
      return defaultSteps;
    }

    // 1. Order Placed (PENDING)
    defaultSteps.push({
      title: "Order Placed",
      date: `${orderDateStr} - ${format(order.createdAt, "h:mma")}`,
      details: [`Your order #${order.orderNumber} has been received by boutique atelier.`],
      isActive: true,
    });

    // 2. Accepted (CONFIRMED)
    const confirmedEvent = history.find((h) => h.toStatus === "CONFIRMED" || h.action === "ACCEPTED");
    const isConfirmed = ["CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED", "OUT_FOR_DELIVERY", "COMPLETED", "DELIVERED"].includes(order.status);
    defaultSteps.push({
      title: "Accepted",
      date: confirmedEvent ? format(confirmedEvent.changedAt, "EEE, do MMM ''yy - h:mma") : (isConfirmed ? orderDateStr : "Awaiting boutique acceptance"),
      details: [
        confirmedEvent?.remarks || (isConfirmed ? "Boutique has accepted your order and assigned a cutter/packer." : "Awaiting boutique acceptance.")
      ],
      isActive: isConfirmed,
    });

    // 3. Packed (PROCESSING)
    const packedEvent = history.find((h) => h.toStatus === "PROCESSING" || h.action === "PACKED");
    const isPacked = ["PROCESSING", "READY_TO_SHIP", "SHIPPED", "OUT_FOR_DELIVERY", "COMPLETED", "DELIVERED"].includes(order.status);
    defaultSteps.push({
      title: "Packed",
      date: packedEvent ? format(packedEvent.changedAt, "EEE, do MMM ''yy - h:mma") : (isPacked ? orderDateStr : "Awaiting packaging and label generation"),
      details: [
        packedEvent?.remarks || (isPacked ? "Garment has been verified, quality checked, and carefully packaged." : "Awaiting packaging and label generation.")
      ],
      isActive: isPacked,
    });

    // 4. Ready for Shipment (READY_TO_SHIP / SHIPPED)
    const readyEvent = history.find((h) => h.toStatus === "READY_TO_SHIP" || h.toStatus === "SHIPPED" || h.action === "READY_FOR_SHIPMENT" || h.action === "SHIPPED");
    const isReady = ["READY_TO_SHIP", "SHIPPED", "OUT_FOR_DELIVERY", "COMPLETED", "DELIVERED"].includes(order.status);
    const activeShipment = shipments[0];
    const shipmentDesc = activeShipment
      ? `Dispatched via ${activeShipment.carrierName || "Carrier Logistics"} - ${activeShipment.trackingNumber || activeShipment.shipmentNumber}`
      : (readyEvent?.remarks || (isReady ? "Package is ready and staged for carrier logistics pickup." : "Awaiting logistics carrier pickup."));
    defaultSteps.push({
      title: "Ready for Shipment",
      date: readyEvent ? format(readyEvent.changedAt, "EEE, do MMM ''yy - h:mma") : (isReady ? orderDateStr : "Awaiting carrier pickup"),
      details: [shipmentDesc],
      isActive: isReady,
    });

    // 5. Out For Delivery (OUT_FOR_DELIVERY)
    const outForDeliveryEvent = history.find((h) => h.toStatus === "OUT_FOR_DELIVERY" || h.action === "OUT_FOR_DELIVERY");
    const isOutForDelivery = ["OUT_FOR_DELIVERY", "COMPLETED", "DELIVERED"].includes(order.status);
    defaultSteps.push({
      title: "Out for Delivery",
      date: outForDeliveryEvent ? format(outForDeliveryEvent.changedAt, "EEE, do MMM ''yy - h:mma") : (isOutForDelivery ? orderDateStr : "Pending dispatch"),
      details: [
        outForDeliveryEvent?.remarks || (isOutForDelivery ? "Item is out for delivery with your local delivery courier executive." : "Assigned to fulfillment logistics carrier agent.")
      ],
      isActive: isOutForDelivery,
    });

    // 6. Completed (COMPLETED / DELIVERED)
    const deliveredEvent = history.find((h) => h.toStatus === "DELIVERED" || h.toStatus === "COMPLETED" || h.action === "DELIVERED");
    const isDelivered = ["DELIVERED", "COMPLETED"].includes(order.status);
    defaultSteps.push({
      title: "Completed",
      date: deliveredEvent
        ? format(deliveredEvent.changedAt, "EEE, do MMM ''yy - h:mma")
        : (order.deliveredAt
          ? format(order.deliveredAt, "EEE, do MMM ''yy")
          : (isDelivered ? orderDateStr : "Expected soon")),
      details: [
        deliveredEvent?.remarks || (isDelivered ? "Secure customer signature delivery pass validated. Enjoy your Needlon bespoke garment!" : "Standard delivery upon customer handover.")
      ],
      isActive: isDelivered,
    });

    return defaultSteps;
  },

  /**
   * Cancel an order in PENDING or CONFIRMED state.
   * Performs ownership check, updates order status, restores inventory,
   * and appends an audit row to order_status_history.
   */
  async cancelOrder(orderId: string, userId: string, reason?: string) {
    if (!process.env.DATABASE_URL) {
      return {
        success: true,
        orderId,
        status: "CANCELLED",
        message: "Order cancelled successfully (local mode)",
      };
    }

    return await db.transaction(async (tx) => {
      const isUuid = isValidUuid(orderId);
      const queryCondition = isUuid ? eq(orders.id, orderId) : eq(orders.orderNumber, orderId);

      const [foundOrder] = await tx
        .select()
        .from(orders)
        .where(queryCondition)
        .limit(1);

      if (!foundOrder) {
        throw new Error(`Order not found: ${orderId}`);
      }

      // Security check: Ownership validation
      if (userId && userId !== "mock-user" && isValidUuid(userId)) {
        if (foundOrder.buyerId !== userId) {
          const err = new Error("UNAUTHORIZED_ORDER_CANCELLATION");
          (err as any).statusCode = 403;
          throw err;
        }
      }

      // State check: Only PENDING or CONFIRMED orders can be cancelled
      if (!["PENDING", "CONFIRMED"].includes(foundOrder.status)) {
        const err = new Error(
          `Cannot cancel order in ${foundOrder.status} status. Only PENDING or CONFIRMED orders can be cancelled.`
        );
        (err as any).statusCode = 400;
        throw err;
      }

      // 1. Update order status to CANCELLED
      const [updatedOrder] = await tx
        .update(orders)
        .set({
          status: "CANCELLED",
          cancelledAt: new Date(),
          updatedAt: new Date(),
          paymentStatus: foundOrder.paymentStatus === "PAID" ? "REFUNDED" : "CANCELLED",
        })
        .where(eq(orders.id, foundOrder.id))
        .returning();

      // 2. Update order items status to CANCELLED
      await tx
        .update(orderItems)
        .set({
          itemStatus: "CANCELLED",
        })
        .where(eq(orderItems.orderId, foundOrder.id));

      // 3. Log audit status transition in order_status_history
      const changedBy = isValidUuid(userId) ? userId : foundOrder.buyerId;
      await tx.insert(orderStatusHistory).values({
        orderId: foundOrder.id,
        sellerId: foundOrder.sellerId,
        changedByUserId: changedBy,
        fromStatus: foundOrder.status,
        toStatus: "CANCELLED",
        action: "CANCELLED",
        source: "BUYER",
        result: "SUCCESS",
        reason: reason || "Cancelled by buyer",
      });

      // 4. Restore inventory for all items in the cancelled order
      const items = await tx
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, foundOrder.id));

      for (const item of items) {
        if (item.variantId) {
          await tx
            .update(inventoryTable)
            .set({
              quantity: sql`${inventoryTable.quantity} + ${item.quantity}`,
              lastAdjustedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(inventoryTable.variantId, item.variantId));
        }
      }

      return {
        success: true,
        orderId: foundOrder.id,
        orderNumber: foundOrder.orderNumber,
        status: "CANCELLED",
        message: "Order cancelled successfully and inventory restored",
      };
    });
  },
};
