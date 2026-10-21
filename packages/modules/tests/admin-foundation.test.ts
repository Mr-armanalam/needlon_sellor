/**
 * Admin foundation integration test (requires a live Postgres):
 *
 *   - platform_settings round-trip: setPlatformSetting -> getCommissionRate,
 *     invalid values fall back to the 5% default, and the earnings summary
 *     actually charges the configured rate (one source of truth)
 *   - delivery partner + shipping-method CRUD via the admin repositories
 *   - category CRUD with materialised path/level/isLeaf maintenance and
 *     delete guards (children / products)
 *   - seller management: store verify toggle + suspend flag persist
 *   - promoteSellerToAdmin flips the role; unknown email returns null
 *   - fresh-DB proof: migrate + sync-all-schemas into a scratch database
 *     creates platform_settings with the seeded commissionRate row, the
 *     seller.is_active column and the shipping-method charge columns
 *
 * Run (from packages/modules):
 *   DATABASE_URL=postgres://needlon:needlon@localhost:5432/needlon_test \
 *     npx tsx tests/admin-foundation.test.ts
 */
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { eq } from "drizzle-orm";

// Env defaults MUST be set before any module that creates the DB client
// (packages/db reads DATABASE_URL at import time) is loaded — hence the
// dynamic imports inside main().
process.env.DATABASE_URL ??=
  "postgres://needlon:needlon@localhost:5432/needlon_test";

const stamp = Date.now().toString().slice(-6);
const sellerId = randomUUID();
const storeId = randomUUID();
const addressId = randomUUID();
const buyerId = randomUUID();
const orderId = randomUUID();
const sellerEmail = `adm-seller-${stamp}@example.com`;
let partnerIdForCleanup = "";
const categoryIdsForCleanup: string[] = [];

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const tsxCli = path.join(
  repoRoot,
  "node_modules",
  ".pnpm",
  "tsx@4.23.15",
  "node_modules",
  "tsx",
  "dist",
  "cli.mjs",
);

function psql(dbName: string, sqlText: string): string {
  return execFileSync(
    "psql",
    ["-h", "localhost", "-U", "needlon", "-d", dbName, "-t", "-A", "-c", sqlText],
    {
      env: { ...process.env, PGPASSWORD: "needlon" },
      encoding: "utf8",
    },
  ).trim();
}

async function main() {
  const { db } = await import("../../db/db/index");
  const { usersTable } = await import("../../db/db/schema/users");
  const { seller } = await import("../../db/db/schema/seller");
  const { sellerStore } = await import("../../db/db/schema/seller/seller-store");
  const { sellerAddresses } = await import(
    "../../db/db/schema/seller/seller-address"
  );
  const { orders } = await import("../../db/db/schema/orders/table");
  const { categoriesTable } = await import(
    "../../db/db/schema/catalog/categories/table"
  );
  const { shippingPartners } = await import(
    "../../db/db/schema/delivery/shipping-partners"
  );
  const { shippingMethods } = await import(
    "../../db/db/schema/delivery/shipping-method"
  );

  const {
    getPlatformSetting,
    setPlatformSetting,
    getCommissionRate,
  } = await import(
    "../modules/platform-settings/services/platform-settings.service"
  );
  const { getSellerEarningsSummary } = await import(
    "../modules/earnings/repository/earnings.repository"
  );
  const {
    createAdminPartner,
    updateAdminPartner,
    listAdminPartners,
    createAdminMethod,
    updateAdminMethod,
    listAdminMethods,
  } = await import("../modules/admin/repository/admin-delivery.repository");
  const {
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
    listAdminCategories,
    getAdminCategory,
  } = await import("../modules/admin/repository/admin-categories.repository");
  const {
    getAdminOverview,
    listAdminSellers,
    updateAdminSeller,
    promoteSellerToAdmin,
  } = await import("../modules/admin/repository/admin.repository");

  async function cleanup() {
    // Restore the seeded commission before fixtures disappear.
    await setPlatformSetting("commissionRate", 0.05, null).catch(() => {});
    if (partnerIdForCleanup) {
      await db
        .delete(shippingMethods)
        .where(eq(shippingMethods.partnerId, partnerIdForCleanup));
      await db
        .delete(shippingPartners)
        .where(eq(shippingPartners.id, partnerIdForCleanup));
    }
    // Children first: categories.parent_id is ON DELETE RESTRICT.
    for (const id of [...categoryIdsForCleanup].reverse()) {
      await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    }
    await db.delete(orders).where(eq(orders.id, orderId));
    await db.delete(sellerAddresses).where(eq(sellerAddresses.id, addressId));
    await db.delete(sellerStore).where(eq(sellerStore.id, storeId));
    await db.delete(usersTable).where(eq(usersTable.id, buyerId));
    await db.delete(seller).where(eq(seller.id, sellerId));
  }

  try {
    console.log("=== ADMIN FOUNDATION ===");

    // Fixtures: a seller + store + address, a buyer, one DELIVERED order.
    await db.insert(seller).values({
      id: sellerId,
      name: "Admin Foundation Seller",
      email: sellerEmail,
      passwordHash: "test-hash",
      emailVerified: true,
    });
    await db.insert(sellerStore).values({
      id: storeId,
      sellerId,
      storeName: "Admin Foundation Store",
      storeSlug: `adm-store-${stamp}`,
    });
    await db.insert(sellerAddresses).values({
      id: addressId,
      sellerId,
      label: "Main",
      addressType: "PICKUP",
      addressLine1: "1 Admin Street",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
    });
    await db.insert(usersTable).values({
      id: buyerId,
      name: "Admin Foundation Buyer",
      email: `adm-buyer-${stamp}@example.com`,
      number: "+91 9000000001",
    });
    await db.insert(orders).values({
      id: orderId,
      sellerId,
      buyerId,
      storeId,
      shippingAddressId: addressId,
      orderNumber: `ADM-ORD-${stamp}`,
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "COD",
      buyerName: "Admin Foundation Buyer",
      buyerEmail: `adm-buyer-${stamp}@example.com`,
      buyerPhone: "9000000001",
      subtotal: "1000.00",
      grandTotal: "1000.00",
    });
    console.log("✓ Fixtures: seller, store, address, buyer, delivered order");

    // (a) Platform settings round-trip + commission wiring ------------------
    await setPlatformSetting("commissionRate", 0.07, sellerId);
    assert.strictEqual(await getCommissionRate(), 0.07);
    assert.strictEqual(await getPlatformSetting("commissionRate"), 0.07);

    const summary = await getSellerEarningsSummary(sellerId);
    assert.strictEqual(summary.grossSales, "1000.00");
    assert.strictEqual(
      summary.commissionFees,
      "70.00",
      "earnings must charge the configured 7% commission",
    );
    assert.strictEqual(summary.netRevenue, "930.00");
    console.log("✓ (a) commissionRate=0.07 flows into the earnings summary");

    // Invalid stored values fall back to the 5% default.
    await setPlatformSetting("commissionRate", "not-a-number", sellerId);
    assert.strictEqual(await getCommissionRate(), 0.05);
    await setPlatformSetting("commissionRate", 0.05, sellerId);
    assert.strictEqual(await getCommissionRate(), 0.05);
    console.log("✓ (a2) invalid commission value falls back to 0.05");

    // (b) Partner + method CRUD ---------------------------------------------
    const partner = await createAdminPartner({
      partnerName: "Admin Test Carrier",
      partnerCode: `admtest-${stamp}`,
      integrationType: "MANUAL",
    });
    partnerIdForCleanup = partner.id;
    assert.strictEqual(partner.partnerCode, `ADMTEST-${stamp}`);
    assert.strictEqual(partner.integrationType, "MANUAL");

    await assert.rejects(
      () =>
        createAdminPartner({
          partnerName: "Duplicate Carrier",
          partnerCode: `admtest-${stamp}`,
        }),
      /already exists/,
      "duplicate partner code must conflict",
    );

    const method = await createAdminMethod(partner.id, {
      methodName: "Admin Test Standard",
      methodCode: `ADMTEST_STD_${stamp}`,
      estimatedMinDays: 2,
      estimatedMaxDays: 5,
      baseCharge: 49.5,
      perKgCharge: 12,
    });
    assert.strictEqual(method.baseCharge, "49.50");
    assert.strictEqual(method.perKgCharge, "12.00");

    const updatedMethod = await updateAdminMethod(method.id, {
      baseCharge: 60,
    });
    assert.strictEqual(updatedMethod.baseCharge, "60.00");

    const partners = await listAdminPartners();
    const listed = partners.find((p) => p.id === partner.id);
    assert.ok(listed, "created partner must be listed");
    assert.strictEqual(listed.methodsCount, 1);
    const methods = await listAdminMethods(partner.id);
    assert.strictEqual(methods.length, 1);

    const deactivated = await updateAdminPartner(partner.id, {
      isActive: false,
    });
    assert.strictEqual(deactivated.isActive, false);
    console.log("✓ (b) partner + method CRUD with rate-card charges");

    // (c) Category CRUD ------------------------------------------------------
    const root = await createAdminCategory(
      { name: `Admin Root ${stamp}` },
      sellerId,
    );
    categoryIdsForCleanup.push(root.id);
    assert.strictEqual(root.level, 0);
    assert.strictEqual(root.path, `/${root.slug}`);
    assert.ok(root.code.startsWith("CAT-"), "code auto-generated");

    const child = await createAdminCategory(
      { name: `Admin Child ${stamp}`, parentId: root.id },
      sellerId,
    );
    categoryIdsForCleanup.push(child.id);
    assert.strictEqual(child.level, 1);
    assert.strictEqual(child.path, `${root.path}/${child.slug}`);

    const rootAfter = await getAdminCategory(root.id);
    assert.strictEqual(rootAfter.isLeaf, false, "parent stops being a leaf");

    const renamed = await updateAdminCategory(
      child.id,
      { name: `Admin Child Renamed ${stamp}` },
      sellerId,
    );
    assert.strictEqual(renamed.name, `Admin Child Renamed ${stamp}`);

    await assert.rejects(
      () => deleteAdminCategory(root.id),
      /subcategories/,
      "deleting a category with children must conflict",
    );

    const deletedChild = await deleteAdminCategory(child.id);
    assert.ok(deletedChild.deletedAt, "delete is a soft delete");
    const listedCategories = await listAdminCategories();
    assert.ok(
      !listedCategories.some((c) => c.id === child.id),
      "soft-deleted category leaves the admin list",
    );
    await deleteAdminCategory(root.id);
    console.log("✓ (c) category CRUD with path/level/isLeaf maintenance");

    // (d) Seller management ----------------------------------------------------
    const verified = await updateAdminSeller(sellerId, { isVerified: true });
    assert.strictEqual(verified.storeVerified, true);
    const [storeRow] = await db
      .select()
      .from(sellerStore)
      .where(eq(sellerStore.id, storeId));
    assert.strictEqual(storeRow.isVerified, true);
    assert.ok(storeRow.verifiedAt, "verifiedAt is stamped");

    const suspended = await updateAdminSeller(sellerId, { isActive: false });
    assert.strictEqual(suspended.isActive, false);
    const [sellerRow] = await db
      .select()
      .from(seller)
      .where(eq(seller.id, sellerId));
    assert.strictEqual(sellerRow.isActive, false);
    await updateAdminSeller(sellerId, { isActive: true });

    const adminSellers = await listAdminSellers();
    const listedSeller = adminSellers.find((s) => s.id === sellerId);
    assert.ok(listedSeller, "fixture seller must be listed");
    assert.strictEqual(listedSeller.ordersCount, 1);
    console.log("✓ (d) verify toggle + suspend flag persist");

    // (e) Promote to admin ------------------------------------------------------
    const promoted = await promoteSellerToAdmin(sellerEmail.toUpperCase());
    assert.ok(promoted, "promotion must find the seller case-insensitively");
    assert.strictEqual(promoted.id, sellerId);
    const [promotedRow] = await db
      .select()
      .from(seller)
      .where(eq(seller.id, sellerId));
    assert.strictEqual(promotedRow.role, "admin");
    const missing = await promoteSellerToAdmin(`missing-${stamp}@example.com`);
    assert.strictEqual(missing, null);
    console.log("✓ (e) promoteSellerToAdmin flips role; unknown email -> null");

    // (f) Overview ---------------------------------------------------------------
    const overview = await getAdminOverview();
    assert.ok(overview.sellers >= 1);
    assert.ok(overview.orders >= 1);
    assert.strictEqual(typeof overview.openSupportTickets, "number");
    console.log(
      `✓ (f) overview counts: sellers=${overview.sellers} orders=${overview.orders} openTickets=${overview.openSupportTickets}`,
    );

    // (g) Fresh-DB proof -----------------------------------------------------------
    const scratchDb = "needlon_test_admin";
    psql("postgres", `DROP DATABASE IF EXISTS ${scratchDb}`);
    psql("postgres", `CREATE DATABASE ${scratchDb}`);
    try {
      const scratchUrl = `postgres://needlon:needlon@localhost:5432/${scratchDb}`;
      const dbPackageDir = path.join(repoRoot, "packages", "db");
      const runScript = (script: string) =>
        execFileSync("node", [tsxCli, script], {
          cwd: dbPackageDir,
          env: { ...process.env, DATABASE_URL: scratchUrl },
          encoding: "utf8",
          timeout: 240_000,
        });
      runScript("db/migrate.ts");
      runScript("scripts/sync-all-schemas.ts");

      const seeded = psql(
        scratchDb,
        "SELECT value::text FROM platform_settings WHERE key = 'commissionRate'",
      );
      assert.strictEqual(seeded, "0.05", "fresh DB seeds commissionRate=0.05");

      const columns = psql(
        scratchDb,
        "SELECT count(*) FROM information_schema.columns WHERE " +
          "(table_name = 'seller' AND column_name = 'is_active') OR " +
          "(table_name = 'shipping_methods' AND column_name IN ('base_charge', 'per_kg_charge'))",
      );
      assert.strictEqual(columns, "3", "fresh DB has suspension + charge columns");
      console.log("✓ (g) fresh DB: platform_settings seeded, new columns present");
    } finally {
      psql(
        "postgres",
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${scratchDb}' AND pid <> pg_backend_pid()`,
      );
      psql("postgres", `DROP DATABASE IF EXISTS ${scratchDb}`);
    }

    console.log("\n=== ALL ADMIN FOUNDATION CHECKS PASSED ===");
  } finally {
    await cleanup().catch((err) => console.error("cleanup failed:", err));
    console.log("✓ Fixtures cleaned up");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("❌ ADMIN FOUNDATION FAILED:", err);
    process.exit(1);
  });
