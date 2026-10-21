/**
 * Shiprocket carrier-booking integration test (requires a live Postgres
 * plus a node:http stub implementing Shiprocket's documented responses):
 *
 *   - bookShipmentWithCarrier persists the carrier AWB + CARRIER_BOOKED
 *     event (provider shipment id in rawPayload), status READY_TO_SHIP
 *   - generateShipmentLabel stores labelUrl / labelGeneratedAt and moves
 *     the shipment to LABEL_GENERATED
 *   - syncShipmentTracking inserts carrier scan events, dedupes on a
 *     second call, and advances shipment + order status
 *   - handleShiprocketWebhook inserts events, advances to DELIVERED, and
 *     dedupes Shiprocket's retries; unknown AWBs are ignored
 *   - a partner with no active connection fails with CarrierError
 *     NOT_CONFIGURED; an unknown API partner fails in the adapter factory;
 *     an INHOUSE shipment rejects API booking with a clear error
 *   - the adapter caches the login token across operations (Shiprocket
 *     rate-limits logins)
 *
 * The stub URL is injected by pointing the seeded SHIPROCKET partner's
 * api_base_url at the stub for the duration of the test (restored after).
 * The session seller is supplied via the TEST_SELLER_ID seam in
 * getCurrentSeller — every service call runs as fixture seller A.
 *
 * Run (from packages/modules):
 *   DATABASE_URL=postgres://needlon:needlon@localhost:5432/needlon_test \
 *     npx tsx tests/shiprocket-booking.test.ts
 */
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { and, eq } from "drizzle-orm";

// Env MUST be set before any module that creates the DB client or reads
// the credentials key is loaded — hence dynamic imports inside main().
process.env.DATABASE_URL ??=
  "postgres://needlon:needlon@localhost:5432/needlon_test";
process.env.CARRIER_CREDENTIALS_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const stamp = Date.now().toString().slice(-6);
const sellerAId = randomUUID();
const storeAId = randomUUID();
const pickupAddressId = randomUUID();
const buyerId = randomUUID();
const categoryId = randomUUID();
const productId = randomUUID();
const orderAId = randomUUID();
const orderNumber = `SRB-ORD-${stamp}`;
const aggPartnerId = randomUUID();
const agg2PartnerId = randomUUID();
const aggMethodId = randomUUID();
const agg2MethodId = randomUUID();

process.env.TEST_SELLER_ID = sellerAId;

const STUB_AWB = "SRTEST123";
const STUB_LABEL_URL = "https://stub.shiprocket.local/labels/555001.pdf";
const shipmentIdsForCleanup: string[] = [];

interface StubState {
  loginCount: number;
  lastBookingPayload: Record<string, unknown> | null;
  lastAuthHeader: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function startStub(state: StubState): Promise<{ server: Server; baseUrl: string }> {
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const send = (obj: Record<string, unknown>): void => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(obj));
      };
      const url = req.url ?? "";
      const rawBody = Buffer.concat(chunks).toString("utf8");
      let parsedBody: unknown = null;
      if (rawBody) {
        try {
          parsedBody = JSON.parse(rawBody) as unknown;
        } catch {
          parsedBody = null;
        }
      }

      if (req.method === "POST" && url.endsWith("/auth/login")) {
        state.loginCount += 1;
        send({ token: "stub-token-abc" });
        return;
      }
      if (req.method === "POST" && url.endsWith("/orders/create/adhoc")) {
        state.lastAuthHeader = req.headers.authorization ?? null;
        if (isRecord(parsedBody)) state.lastBookingPayload = parsedBody;
        send({
          order_id: 98765,
          shipment_id: 555001,
          status: "NEW",
          awb_code: STUB_AWB,
          courier_name: "Delhivery",
        });
        return;
      }
      if (req.method === "POST" && url.endsWith("/courier/generate/label")) {
        send({ label_created: true, label_url: STUB_LABEL_URL });
        return;
      }
      if (req.method === "GET" && url.endsWith(`/courier/track/awb/${STUB_AWB}`)) {
        send({
          tracking_data: {
            track_status: 1,
            shipment_status: 6,
            shipment_track: [],
            shipment_track_activities: [
              {
                date: "2026-10-21 09:15:00",
                status: "IN TRANSIT",
                activity: "Reached at destination hub",
                location: "Pune Hub",
                "sr-status": "5",
                "sr-status-label": "IN TRANSIT",
              },
              {
                date: "2026-10-21 12:45:00",
                status: "OUT FOR DELIVERY",
                activity: "Out for delivery",
                location: "Pune",
                "sr-status": "6",
                "sr-status-label": "OUT FOR DELIVERY",
              },
            ],
          },
        });
        return;
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `stub: no route for ${req.method} ${url}` }));
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address() as AddressInfo;
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}/v1/external`,
      });
    });
  });
}

async function main() {
  const { db } = await import("../../db/db/index");
  const { usersTable } = await import("../../db/db/schema/users");
  const { seller } = await import("../../db/db/schema/seller");
  const { sellerStore } = await import("../../db/db/schema/seller/seller-store");
  const { sellerAddresses } = await import(
    "../../db/db/schema/seller/seller-address"
  );
  const { categoriesTable } = await import(
    "../../db/db/schema/catalog/categories/table"
  );
  const { productsTable } = await import(
    "../../db/db/schema/catalog/products/table"
  );
  const { orders } = await import("../../db/db/schema/orders/table");
  const { orderItems } = await import(
    "../../db/db/schema/orders/order-items/table"
  );
  const { orderAddresses } = await import(
    "../../db/db/schema/orders/order-address"
  );
  const { shippingPartners } = await import(
    "../../db/db/schema/delivery/shipping-partners"
  );
  const { shippingMethods } = await import(
    "../../db/db/schema/delivery/shipping-method"
  );
  const { shipmentOrders } = await import(
    "../../db/db/schema/delivery/shipping-orders"
  );
  const { shipmentTrackingEvents } = await import(
    "../../db/db/schema/delivery/shipping-tracking-events"
  );
  const { sellerCarrierConnections } = await import(
    "../../db/db/schema/delivery/seller-carrier-connections"
  );
  const { sellerDeliverySettings } = await import(
    "../../db/db/schema/delivery/seller-delivery-settings"
  );
  const { getShippingPartners } = await import(
    "../modules/delivery/repository/delivery.repository"
  );
  const { encryptCredentials } = await import(
    "../modules/delivery/lib/credentials-crypto"
  );
  const {
    bookShipmentWithCarrier,
    generateShipmentLabel,
    syncShipmentTracking,
    handleShiprocketWebhook,
  } = await import("../modules/delivery/services/carrier-booking.service");
  const { CarrierError } = await import("../modules/delivery/carriers");

  const stubState: StubState = {
    loginCount: 0,
    lastBookingPayload: null,
    lastAuthHeader: null,
  };
  const { server, baseUrl } = await startStub(stubState);

  let originalShiprocketBaseUrl: string | null = null;
  let shiprocketId = "";
  let srShipmentId = "";
  let inhouseShipmentId = "";
  let aggShipmentId = "";
  let agg2ShipmentId = "";

  async function cleanup() {
    server.close();
    for (const shipmentId of shipmentIdsForCleanup) {
      await db
        .delete(shipmentTrackingEvents)
        .where(eq(shipmentTrackingEvents.shipmentId, shipmentId));
    }
    await db.delete(shipmentOrders).where(eq(shipmentOrders.orderId, orderAId));
    await db
      .delete(sellerCarrierConnections)
      .where(eq(sellerCarrierConnections.sellerId, sellerAId));
    await db
      .delete(sellerDeliverySettings)
      .where(eq(sellerDeliverySettings.sellerId, sellerAId));
    await db.delete(orderAddresses).where(eq(orderAddresses.orderId, orderAId));
    await db.delete(orderItems).where(eq(orderItems.orderId, orderAId));
    await db.delete(orders).where(eq(orders.id, orderAId));
    await db.delete(productsTable).where(eq(productsTable.id, productId));
    await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId));
    await db
      .delete(shippingMethods)
      .where(eq(shippingMethods.partnerId, aggPartnerId));
    await db
      .delete(shippingMethods)
      .where(eq(shippingMethods.partnerId, agg2PartnerId));
    await db.delete(shippingPartners).where(eq(shippingPartners.id, aggPartnerId));
    await db.delete(shippingPartners).where(eq(shippingPartners.id, agg2PartnerId));
    if (shiprocketId) {
      await db
        .update(shippingPartners)
        .set({ apiBaseUrl: originalShiprocketBaseUrl })
        .where(eq(shippingPartners.id, shiprocketId));
    }
    await db.delete(sellerAddresses).where(eq(sellerAddresses.id, pickupAddressId));
    await db.delete(sellerStore).where(eq(sellerStore.id, storeAId));
    await db.delete(usersTable).where(eq(usersTable.id, buyerId));
    await db.delete(seller).where(eq(seller.id, sellerAId));
  }

  try {
    console.log("=== SHIPROCKET CARRIER BOOKING ===");
    console.log(`✓ Stub Shiprocket server at ${baseUrl}`);

    // ---- Fixtures -------------------------------------------------------
    await db.insert(seller).values({
      id: sellerAId,
      name: "Shiprocket Seller A",
      email: `srb-seller-${stamp}@example.com`,
      passwordHash: "test-hash",
    });
    await db.insert(sellerStore).values({
      id: storeAId,
      sellerId: sellerAId,
      storeName: "Shiprocket Store A",
      storeSlug: `srb-store-${stamp}`,
    });
    await db.insert(sellerAddresses).values({
      id: pickupAddressId,
      sellerId: sellerAId,
      label: "Main",
      addressType: "PICKUP",
      addressLine1: "9 Industrial Estate",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411019",
      isDefault: true,
    });
    await db.insert(usersTable).values({
      id: buyerId,
      name: "Stub Buyer",
      email: `srb-buyer-${stamp}@example.com`,
      number: "+91 9812345678",
    });
    await db.insert(categoriesTable).values({
      id: categoryId,
      name: "Stub Category",
      slug: `srb-cat-${stamp}`,
      code: `SRB${stamp}`,
      path: `/srb-cat-${stamp}`,
    });
    await db.insert(productsTable).values({
      id: productId,
      // products.storeId is the seller_id column (FK to seller_store.seller_id).
      storeId: sellerAId,
      categoryId,
      name: "Stub Kurta",
      slug: `srb-kurta-${stamp}`,
      status: "PUBLISHED",
    });
    await db.insert(orders).values({
      id: orderAId,
      sellerId: sellerAId,
      buyerId,
      storeId: storeAId,
      shippingAddressId: pickupAddressId,
      orderNumber,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "COD",
      buyerName: "Stub Buyer",
      buyerEmail: `srb-buyer-${stamp}@example.com`,
      buyerPhone: "9812345678",
      subtotal: "1700.00",
      shippingCharge: "50.00",
      grandTotal: "1750.00",
    });
    await db.insert(orderItems).values({
      orderId: orderAId,
      sellerId: sellerAId,
      productId,
      sku: "SRB-KURTA-M",
      productSlug: `srb-kurta-${stamp}`,
      productName: "Stub Kurta",
      unitPrice: "850.00",
      quantity: 2,
      subtotal: "1700.00",
      total: "1700.00",
      weight: "0.30",
      length: "30.00",
      width: "25.00",
      height: "5.00",
    });
    await db.insert(orderAddresses).values({
      orderId: orderAId,
      addressType: "DELIVERY",
      recipientName: "Stub Buyer",
      phoneNumber: "9812345678",
      addressLine1: "22 MG Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
    });
    await db.insert(sellerDeliverySettings).values({
      sellerId: sellerAId,
      hubName: "Stub Hub",
      hubAddress: "9 Industrial Estate",
      hubCity: "Pune",
      hubPincode: "411019",
      hubPhone: "9822000000",
    });
    console.log("✓ Fixtures: seller, store, buyer, category, product, order + item + delivery address");

    // Partners: point SHIPROCKET at the stub; create temp AGGREGATOR_API
    // partners for the NOT_CONFIGURED paths; resolve seeded methods.
    const partners = await getShippingPartners();
    const shiprocket = partners.find((p) => p.partnerCode === "SHIPROCKET");
    const inhouse = partners.find((p) => p.partnerCode === "INHOUSE");
    assert.ok(shiprocket && inhouse, "Seeded SHIPROCKET + INHOUSE partners required");
    shiprocketId = shiprocket.id;
    originalShiprocketBaseUrl = shiprocket.apiBaseUrl;
    await db
      .update(shippingPartners)
      .set({ apiBaseUrl: baseUrl })
      .where(eq(shippingPartners.id, shiprocket.id));

    const [srMethod] = await db
      .select()
      .from(shippingMethods)
      .where(eq(shippingMethods.partnerId, shiprocket.id))
      .limit(1);
    const [inhouseMethod] = await db
      .select()
      .from(shippingMethods)
      .where(eq(shippingMethods.partnerId, inhouse.id))
      .limit(1);
    assert.ok(srMethod && inhouseMethod, "Seeded methods required");

    await db.insert(shippingPartners).values([
      {
        id: aggPartnerId,
        partnerCode: `AGG-${stamp}`,
        partnerName: "Stub Aggregator",
        integrationType: "AGGREGATOR_API",
        apiBaseUrl: baseUrl,
      },
      {
        id: agg2PartnerId,
        partnerCode: `AGG2-${stamp}`,
        partnerName: "Stub Aggregator 2",
        integrationType: "AGGREGATOR_API",
        apiBaseUrl: baseUrl,
      },
    ]);
    await db.insert(shippingMethods).values([
      { id: aggMethodId, partnerId: aggPartnerId, methodCode: "AGG_STD", methodName: "Agg Standard" },
      { id: agg2MethodId, partnerId: agg2PartnerId, methodCode: "AGG2_STD", methodName: "Agg2 Standard" },
    ]);

    // Connections: seller A connects SHIPROCKET (email/password payload)
    // and AGG2 (credentials present, but no adapter exists for its code).
    await db.insert(sellerCarrierConnections).values([
      {
        sellerId: sellerAId,
        partnerId: shiprocket.id,
        environment: "SANDBOX",
        credentialsEncrypted: encryptCredentials({
          email: "srb-account@shiprocket.test",
          password: "stub-password",
        }),
        isActive: true,
      },
      {
        sellerId: sellerAId,
        partnerId: agg2PartnerId,
        environment: "SANDBOX",
        credentialsEncrypted: encryptCredentials({
          email: "agg2@carrier.test",
          password: "stub-password",
        }),
        isActive: true,
      },
    ]);
    console.log("✓ SHIPROCKET partner pointed at stub; temp aggregator partners created");

    // Pre-booking shipments are inserted directly: createShipmentOrder
    // (correctly) refuses API-partner shipments without an AWB, and a
    // pre-booking shipment by definition has none yet.
    const insertShipment = async (
      partnerId: string,
      methodId: string,
      suffix: string,
    ): Promise<string> => {
      const [row] = await db
        .insert(shipmentOrders)
        .values({
          sellerId: sellerAId,
          orderId: orderAId,
          buyerId,
          shippingPartnerId: partnerId,
          shippingMethodId: methodId,
          shipmentNumber: `SHP-${suffix}-${stamp}`,
          awbNumber: null,
          trackingNumber: null,
          status: "PENDING",
          shippingCost: "50.00",
          codAmount: "1750.00",
        })
        .returning();
      assert.ok(row, "Shipment fixture must be created");
      shipmentIdsForCleanup.push(row.id);
      return row.id;
    };
    srShipmentId = await insertShipment(shiprocket.id, srMethod.id, "SR");
    inhouseShipmentId = await insertShipment(inhouse.id, inhouseMethod.id, "IH");
    aggShipmentId = await insertShipment(aggPartnerId, aggMethodId, "AGG");
    agg2ShipmentId = await insertShipment(agg2PartnerId, agg2MethodId, "AGG2");
    console.log("✓ Pre-booking shipments inserted (PENDING, no AWB)");

    // ---- (a) Booking ----------------------------------------------------
    const booked = await bookShipmentWithCarrier(srShipmentId);
    assert.strictEqual(booked.booking.awb, STUB_AWB);
    assert.strictEqual(booked.booking.courierName, "Delhivery");
    assert.strictEqual(booked.booking.providerShipmentId, "555001");
    assert.strictEqual(booked.shipment.awbNumber, STUB_AWB);
    assert.strictEqual(booked.shipment.trackingNumber, STUB_AWB);
    assert.strictEqual(booked.shipment.status, "READY_TO_SHIP");

    const payload = stubState.lastBookingPayload;
    assert.ok(payload, "Stub must receive the adhoc create payload");
    assert.strictEqual(payload["order_id"], orderNumber);
    assert.strictEqual(payload["payment_method"], "COD");
    assert.strictEqual(payload["billing_pincode"], "411001");
    assert.strictEqual(payload["billing_phone"], "9812345678");
    assert.strictEqual(payload["pickup_location"], "Stub Hub");
    const payloadItems = payload["order_items"];
    assert.ok(Array.isArray(payloadItems) && payloadItems.length === 1);
    assert.strictEqual(stubState.lastAuthHeader, "Bearer stub-token-abc");

    const [bookedRow] = await db
      .select()
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, srShipmentId));
    assert.strictEqual(bookedRow?.awbNumber, STUB_AWB);
    const bookedEvents = await db
      .select()
      .from(shipmentTrackingEvents)
      .where(
        and(
          eq(shipmentTrackingEvents.shipmentId, srShipmentId),
          eq(shipmentTrackingEvents.eventCode, "CARRIER_BOOKED"),
        ),
      );
    assert.strictEqual(bookedEvents.length, 1);
    const bookedPayload = bookedEvents[0]?.rawPayload;
    assert.ok(isRecord(bookedPayload), "Booking event must carry rawPayload");
    assert.strictEqual(bookedPayload["providerShipmentId"], "555001");
    console.log("✓ (a) booking persisted AWB SRTEST123 + CARRIER_BOOKED event; payload mapped from order data");

    // ---- (b) Label ------------------------------------------------------
    const label = await generateShipmentLabel(srShipmentId);
    assert.strictEqual(label.labelUrl, STUB_LABEL_URL);
    assert.strictEqual(label.shipment.labelUrl, STUB_LABEL_URL);
    assert.ok(label.shipment.labelGeneratedAt, "labelGeneratedAt must be set");
    assert.strictEqual(label.shipment.status, "LABEL_GENERATED");
    console.log("✓ (b) label generated via provider shipment id from booking event; labelUrl persisted");

    // ---- (c) Tracking sync + dedupe -------------------------------------
    const sync1 = await syncShipmentTracking(srShipmentId);
    assert.strictEqual(sync1.eventsReceived, 2);
    assert.strictEqual(sync1.eventsInserted, 2);
    assert.strictEqual(sync1.currentStatus, "OUT FOR DELIVERY");

    const [afterSync] = await db
      .select()
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, srShipmentId));
    assert.strictEqual(afterSync?.status, "OUT_FOR_DELIVERY");
    const [orderAfterSync] = await db
      .select({ status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderAId));
    assert.strictEqual(orderAfterSync?.status, "OUT_FOR_DELIVERY");

    const sync2 = await syncShipmentTracking(srShipmentId);
    assert.strictEqual(sync2.eventsInserted, 0, "Second sync must dedupe carrier events");
    console.log("✓ (c) tracking sync inserted 2 events, advanced shipment + order to OUT_FOR_DELIVERY, deduped on re-sync");

    // Token caching: login happened once despite book + label + 2 syncs.
    assert.strictEqual(
      stubState.loginCount,
      1,
      `Shiprocket login must be cached across operations (saw ${stubState.loginCount})`,
    );
    console.log("✓ (d) Shiprocket auth token cached across booking/label/sync calls");

    // ---- (e) Webhook ----------------------------------------------------
    const webhookResult = await handleShiprocketWebhook({
      awb: STUB_AWB,
      order_id: orderNumber,
      current_status: "DELIVERED",
      current_timestamp: "2026-10-21 18:30:00",
      courier_name: "Delhivery",
    });
    assert.strictEqual(webhookResult.ignored, false);
    assert.strictEqual(webhookResult.shipmentId, srShipmentId);
    const [afterWebhook] = await db
      .select()
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, srShipmentId));
    assert.strictEqual(afterWebhook?.status, "DELIVERED");
    const [orderAfterWebhook] = await db
      .select({ status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderAId));
    assert.strictEqual(orderAfterWebhook?.status, "DELIVERED");

    const webhookRetry = await handleShiprocketWebhook({
      awb: STUB_AWB,
      order_id: orderNumber,
      current_status: "DELIVERED",
      current_timestamp: "2026-10-21 18:30:00",
      courier_name: "Delhivery",
    });
    assert.strictEqual(webhookRetry.duplicate, true, "Retried webhook must dedupe");

    const unknownAwb = await handleShiprocketWebhook({
      awb: "SR-UNKNOWN-999",
      current_status: "DELIVERED",
      current_timestamp: "2026-10-21 18:30:00",
    });
    assert.strictEqual(unknownAwb.ignored, true);
    console.log("✓ (e) webhook recorded DELIVERED (shipment + order), retry deduped, unknown AWB ignored");

    // ---- (f) Error paths --------------------------------------------------
    await assert.rejects(
      () => bookShipmentWithCarrier(aggShipmentId),
      (err: unknown) =>
        err instanceof CarrierError && err.carrierCode === "NOT_CONFIGURED",
      "Partner without a connection must fail NOT_CONFIGURED",
    );
    await assert.rejects(
      () => bookShipmentWithCarrier(agg2ShipmentId),
      (err: unknown) =>
        err instanceof CarrierError && err.carrierCode === "NOT_CONFIGURED",
      "API partner without an implemented adapter must fail NOT_CONFIGURED",
    );
    await assert.rejects(
      () => bookShipmentWithCarrier(inhouseShipmentId),
      /does not support API booking/,
      "INHOUSE shipment must reject API booking with a clear error",
    );
    console.log("✓ (f) NOT_CONFIGURED for missing connection + unknown adapter; INHOUSE booking rejected clearly");

    console.log("=== ALL SHIPROCKET BOOKING CHECKS PASSED ===");
  } finally {
    await cleanup();
    console.log("✓ Fixtures cleaned up; SHIPROCKET api_base_url restored");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("Shiprocket booking test failed:", err);
    process.exit(1);
  });
