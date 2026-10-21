/**
 * Delivery foundation integration test (requires a live Postgres):
 *
 *   - partners come from the DB only (no runtime auto-seed of sandbox rows)
 *   - reading shipments never creates shipment rows
 *   - per-seller delivery settings persist in the DB and are tenant-isolated
 *   - connect-carrier stores ENCRYPTED per-seller credentials and never
 *     mutates the shared shipping_partners row
 *   - AWB provenance: in-house shipments derive `NDL-<orderNumber>`;
 *     API partners without a supplied AWB fail loudly
 *   - shipment status changes write shipment_tracking_events rows and are
 *     ownership-scoped
 *
 * Run (from packages/modules):
 *   DATABASE_URL=postgres://needlon:needlon@localhost:5432/needlon_test \
 *     npx tsx tests/delivery-foundation.test.ts
 */
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";

// Env defaults MUST be set before any module that creates the DB client
// (packages/db reads DATABASE_URL at import time) or the credentials
// crypto (reads CARRIER_CREDENTIALS_KEY per call) is loaded — hence the
// dynamic imports inside main().
process.env.DATABASE_URL ??=
  "postgres://needlon:needlon@localhost:5432/needlon_test";
process.env.CARRIER_CREDENTIALS_KEY ??=
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const stamp = Date.now().toString().slice(-6);
const sellerAId = randomUUID();
const sellerBId = randomUUID();
const storeAId = randomUUID();
const addressAId = randomUUID();
const buyerId = randomUUID();
const orderAId = randomUUID();
const orderNumber = `DFT-ORD-${stamp}`;
let shipmentIdForCleanup = "";
let executiveIdForCleanup = "";

async function main() {
  const { db } = await import("../../db/db/index");
  const { usersTable } = await import("../../db/db/schema/users");
  const { seller } = await import("../../db/db/schema/seller");
  const { sellerStore } = await import("../../db/db/schema/seller/seller-store");
  const { sellerAddresses } = await import(
    "../../db/db/schema/seller/seller-address"
  );
  const { orders } = await import("../../db/db/schema/orders/table");
  const { shipmentOrders } = await import(
    "../../db/db/schema/delivery/shipping-orders"
  );
  const { shipmentTrackingEvents } = await import(
    "../../db/db/schema/delivery/shipping-tracking-events"
  );
  const { sellerCarrierConnections } = await import(
    "../../db/db/schema/delivery/seller-carrier-connections"
  );
  const { sellerDeliverySettings, sellerShippingZones } = await import(
    "../../db/db/schema/delivery/seller-delivery-settings"
  );
  const { shippingPartners } = await import(
    "../../db/db/schema/delivery/shipping-partners"
  );
  const { deliveryExecutives } = await import(
    "../../db/db/schema/delivery/delivery-executives"
  );
  const {
    getShippingPartners,
    getSellerShipments,
    getDeliverySettingsRepo,
    updateLocalDeliverySettingsRepo,
    updatePickupHubRepo,
    addShippingZoneRepo,
    connectCarrierRepo,
    createShipmentOrder,
    updateShipmentStatus,
  } = await import("../modules/delivery/repository/delivery.repository");
  const { decryptCredentials } = await import(
    "../modules/delivery/lib/credentials-crypto"
  );

  async function cleanup() {
    if (shipmentIdForCleanup) {
      await db
        .delete(shipmentTrackingEvents)
        .where(eq(shipmentTrackingEvents.shipmentId, shipmentIdForCleanup));
    }
    await db.delete(shipmentOrders).where(eq(shipmentOrders.orderId, orderAId));
    if (executiveIdForCleanup) {
      await db
        .delete(deliveryExecutives)
        .where(eq(deliveryExecutives.id, executiveIdForCleanup));
    }
    await db
      .delete(sellerCarrierConnections)
      .where(eq(sellerCarrierConnections.sellerId, sellerAId));
    await db
      .delete(sellerShippingZones)
      .where(eq(sellerShippingZones.sellerId, sellerAId));
    await db
      .delete(sellerDeliverySettings)
      .where(eq(sellerDeliverySettings.sellerId, sellerAId));
    await db.delete(orders).where(eq(orders.id, orderAId));
    await db.delete(sellerAddresses).where(eq(sellerAddresses.id, addressAId));
    await db.delete(sellerStore).where(eq(sellerStore.id, storeAId));
    await db.delete(usersTable).where(eq(usersTable.id, buyerId));
    await db.delete(seller).where(eq(seller.id, sellerAId));
    await db.delete(seller).where(eq(seller.id, sellerBId));
  }

  try {
    console.log("=== DELIVERY FOUNDATION ===");

    // Fixtures: two sellers, a store + address for seller A, a buyer, an order
    await db.insert(seller).values([
      {
        id: sellerAId,
        name: "Foundation Seller A",
        email: `dft-seller-a-${stamp}@example.com`,
        passwordHash: "test-hash",
      },
      {
        id: sellerBId,
        name: "Foundation Seller B",
        email: `dft-seller-b-${stamp}@example.com`,
        passwordHash: "test-hash",
      },
    ]);
    await db.insert(sellerStore).values({
      id: storeAId,
      sellerId: sellerAId,
      storeName: "Foundation Store A",
      storeSlug: `dft-store-${stamp}`,
    });
    await db.insert(sellerAddresses).values({
      id: addressAId,
      sellerId: sellerAId,
      label: "Main",
      addressType: "PICKUP",
      addressLine1: "1 Foundation Street",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
    });
    await db.insert(usersTable).values({
      id: buyerId,
      name: "Foundation Buyer",
      email: `dft-buyer-${stamp}@example.com`,
      number: "+91 9000000000",
    });
    await db.insert(orders).values({
      id: orderAId,
      sellerId: sellerAId,
      buyerId,
      storeId: storeAId,
      shippingAddressId: addressAId,
      orderNumber,
      status: "PENDING",
      paymentStatus: "PAID",
      paymentMethod: "COD",
      buyerName: "Foundation Buyer",
      buyerEmail: `dft-buyer-${stamp}@example.com`,
      buyerPhone: "9000000000",
      subtotal: "1000.00",
      grandTotal: "1000.00",
    });
    console.log("✓ Fixtures: sellers A/B, store, address, buyer, order created");

    // (a) Partners come from the DB seed only — no sandbox auto-seed rows
    const partners = await getShippingPartners();
    const codes = partners.map((p) => p.partnerCode);
    assert.ok(codes.includes("SHIPROCKET"), "SHIPROCKET partner must exist");
    assert.ok(codes.includes("INHOUSE"), "INHOUSE partner must exist");
    assert.ok(!codes.includes("FEDEX"), "FEDEX sandbox row must NOT be auto-seeded");
    assert.ok(!codes.includes("SHIPPO"), "SHIPPO sandbox row must NOT be auto-seeded");
    const shiprocket = partners.find((p) => p.partnerCode === "SHIPROCKET");
    const inhouse = partners.find((p) => p.partnerCode === "INHOUSE");
    assert.ok(shiprocket && inhouse, "Seeded partners must be resolvable");
    console.log(`✓ (a) partners from DB only: ${codes.join(", ")}`);

    // (b) Reading shipments creates nothing
    const shipmentsBefore = await getSellerShipments(sellerAId);
    assert.strictEqual(
      shipmentsBefore.length,
      0,
      "A fresh order must list zero shipments",
    );
    const shipmentRows = await db
      .select({ id: shipmentOrders.id })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.orderId, orderAId));
    assert.strictEqual(
      shipmentRows.length,
      0,
      "getSellerShipments must not insert shipment rows on read",
    );
    console.log("✓ (b) shipment read is side-effect free (0 rows created)");

    // (c) Settings: defaults for a fresh seller, persistence + isolation
    const defaultsB = await getDeliverySettingsRepo(sellerBId);
    assert.strictEqual(defaultsB.localRadius.maxRadiusKm, 15);
    assert.strictEqual(defaultsB.localRadius.baseCharge, 0);
    assert.strictEqual(defaultsB.pickupHub.hubName, "");
    assert.strictEqual(defaultsB.pickupHub.city, "");
    assert.strictEqual(defaultsB.zones.length, 0);

    await updateLocalDeliverySettingsRepo(sellerAId, {
      maxRadiusKm: 25,
      baseCharge: 40,
      freeShippingThreshold: 999,
    });
    await updatePickupHubRepo(sellerAId, {
      hubName: "Seller A Hub",
      address: "42 Test Lane",
      city: "Pune",
      pincode: "411001",
      phone: "+91 9000000001",
      operatingHours: "Mon-Sat 9-7",
    });
    const zonesAfterAdd = await addShippingZoneRepo(sellerAId, {
      zoneName: "Local Zone",
      partnerCode: "INHOUSE",
      flatRateFee: 25,
      estimatedDays: "1-2 days",
    });
    assert.strictEqual(zonesAfterAdd.length, 1);

    const settingsA = await getDeliverySettingsRepo(sellerAId);
    assert.strictEqual(settingsA.localRadius.maxRadiusKm, 25);
    assert.strictEqual(settingsA.localRadius.baseCharge, 40);
    assert.strictEqual(settingsA.localRadius.freeShippingThreshold, 999);
    assert.strictEqual(settingsA.pickupHub.hubName, "Seller A Hub");
    assert.strictEqual(settingsA.pickupHub.city, "Pune");
    assert.strictEqual(settingsA.zones.length, 1);
    assert.strictEqual(settingsA.zones[0]?.zoneName, "Local Zone");
    assert.strictEqual(settingsA.zones[0]?.flatRateFee, 25);

    const settingsBAfter = await getDeliverySettingsRepo(sellerBId);
    assert.strictEqual(settingsBAfter.localRadius.maxRadiusKm, 15);
    assert.strictEqual(settingsBAfter.localRadius.baseCharge, 0);
    assert.strictEqual(settingsBAfter.pickupHub.hubName, "");
    assert.strictEqual(settingsBAfter.zones.length, 0);
    console.log("✓ (c) settings persist per-seller in DB; seller B sees defaults");

    // (d) Connect carrier: encrypted per-seller credentials, partner untouched
    const [partnerBefore] = await db
      .select({ isActive: shippingPartners.isActive })
      .from(shippingPartners)
      .where(eq(shippingPartners.id, shiprocket.id));
    const connectResult = await connectCarrierRepo(sellerAId, {
      partnerId: shiprocket.id,
      partnerCode: "SHIPROCKET",
      apiKey: "dft-test-key-123",
      apiSecret: "dft-test-secret-456",
      isSandbox: true,
      isActive: true,
    });
    assert.strictEqual(connectResult.hasCredentials, true);
    assert.strictEqual(connectResult.environment, "SANDBOX");
    assert.strictEqual(connectResult.isActive, true);
    assert.ok(
      !("credentialsEncrypted" in connectResult),
      "Response must not carry ciphertext",
    );
    assert.ok(
      !("apiKey" in connectResult),
      "Response must not carry the api key",
    );

    const [connection] = await db
      .select()
      .from(sellerCarrierConnections)
      .where(
        and(
          eq(sellerCarrierConnections.sellerId, sellerAId),
          eq(sellerCarrierConnections.partnerId, shiprocket.id),
        ),
      );
    assert.ok(connection, "Connection row must exist");
    assert.ok(
      connection.credentialsEncrypted,
      "Credentials must be stored encrypted",
    );
    assert.ok(
      !connection.credentialsEncrypted.includes("dft-test-key-123"),
      "Ciphertext must not contain the plaintext key",
    );
    const decrypted = decryptCredentials(connection.credentialsEncrypted);
    assert.deepStrictEqual(decrypted, {
      apiKey: "dft-test-key-123",
      apiSecret: "dft-test-secret-456",
    });

    const [partnerAfter] = await db
      .select({ isActive: shippingPartners.isActive })
      .from(shippingPartners)
      .where(eq(shippingPartners.id, shiprocket.id));
    assert.strictEqual(
      partnerAfter?.isActive,
      partnerBefore?.isActive,
      "Connect must not mutate the shared shipping_partners row",
    );

    // Blank credential fields keep the stored ciphertext; environment flips
    const ciphertextBefore = connection.credentialsEncrypted;
    const reconnectResult = await connectCarrierRepo(sellerAId, {
      partnerId: shiprocket.id,
      partnerCode: "SHIPROCKET",
      isSandbox: false,
      isActive: true,
    });
    assert.strictEqual(reconnectResult.environment, "LIVE");
    const [connectionAfter] = await db
      .select({
        credentialsEncrypted: sellerCarrierConnections.credentialsEncrypted,
      })
      .from(sellerCarrierConnections)
      .where(eq(sellerCarrierConnections.id, connection.id));
    assert.strictEqual(
      connectionAfter?.credentialsEncrypted,
      ciphertextBefore,
      "Blank credential fields must keep the existing ciphertext",
    );
    console.log(
      "✓ (d) credentials encrypted at rest, round-trip decrypts, partner row untouched",
    );

    // (e) In-house shipment: AWB derived from the order number
    const inhouseShipment = await createShipmentOrder(sellerAId, {
      orderId: orderAId,
      shippingPartnerId: inhouse.id,
      shippingCost: 0,
      codAmount: 0,
    });
    shipmentIdForCleanup = inhouseShipment.id;
    assert.ok(
      inhouseShipment.awbNumber?.startsWith("NDL-"),
      "In-house AWB must start with NDL-",
    );
    assert.strictEqual(inhouseShipment.awbNumber, `NDL-${orderNumber}`);
    assert.strictEqual(
      inhouseShipment.trackingNumber,
      inhouseShipment.awbNumber,
    );
    console.log(`✓ (e) in-house shipment AWB = ${inhouseShipment.awbNumber}`);

    // (f) API partner without a supplied AWB fails loudly
    await assert.rejects(
      () =>
        createShipmentOrder(sellerAId, {
          orderId: orderAId,
          shippingPartnerId: shiprocket.id,
          shippingCost: 0,
          codAmount: 0,
        }),
      /cannot issue an AWB automatically/,
    );
    console.log("✓ (f) SHIPROCKET shipment without AWB throws a clear error");

    // (g) Status updates write tracking events and are ownership-scoped
    await updateShipmentStatus(sellerAId, {
      shipmentId: inhouseShipment.id,
      status: "IN_TRANSIT",
    });
    const events = await db
      .select()
      .from(shipmentTrackingEvents)
      .where(eq(shipmentTrackingEvents.shipmentId, inhouseShipment.id));
    assert.ok(events.length >= 1, "A tracking event row must be written");
    assert.strictEqual(events[0]?.trackingStatus, "IN_TRANSIT");
    assert.strictEqual(events[0]?.eventCode, "IN_TRANSIT");

    await assert.rejects(
      () =>
        updateShipmentStatus(sellerBId, {
          shipmentId: inhouseShipment.id,
          status: "DELIVERED",
        }),
      /Shipment not found for this seller/,
    );
    console.log("✓ (g) tracking event written; cross-seller update rejected");

    // (h) Executive display resolves through the real executive FK, and
    // the list response keeps its shape (orderId = order number,
    // rawOrderId = order UUID)
    const [executiveRow] = await db
      .insert(deliveryExecutives)
      .values({
        name: "Foundation Exec",
        phone: `+91 91000${stamp}`,
        vehicleType: "Bike / Two Wheeler",
        status: "ACTIVE",
      })
      .returning();
    assert.ok(executiveRow, "Executive fixture must be created");
    executiveIdForCleanup = executiveRow.id;
    await db
      .update(shipmentOrders)
      .set({ executiveId: executiveRow.id })
      .where(eq(shipmentOrders.id, inhouseShipment.id));
    const listed = await getSellerShipments(sellerAId);
    const mine = listed.find((s) => s.rawOrderId === orderAId);
    assert.ok(mine, "Shipment must be listed for its order");
    assert.strictEqual(mine.orderId, orderNumber);
    assert.strictEqual(mine.executive?.executiveName, "Foundation Exec");
    assert.strictEqual(mine.executive?.executivePhone, executiveRow.phone);
    assert.strictEqual(
      mine.executive?.vehicleType,
      "Bike / Two Wheeler",
    );
    console.log("✓ (h) executive resolved via delivery_executives FK; list shape preserved");

    console.log("=== ALL DELIVERY FOUNDATION CHECKS PASSED ===");
  } finally {
    await cleanup();
    console.log("✓ Fixtures cleaned up");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("Delivery foundation test failed:", err);
    process.exit(1);
  });
