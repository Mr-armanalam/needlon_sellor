import assert from "node:assert";
import { getTableName } from "drizzle-orm";
import {
  cartTable,
  cartItemsTable,
  userAddressesTable,
  wishlistTable,
  clientHeroBannersTable,
  clientSearchHistoryTable,
  clientRecentlyViewedTable,
  clientLoyaltyAccountsTable,
} from "../../db/db/schema/client";

async function testClientSchemas() {
  console.log("--> Testing Client Database Schemas (Phase 1)...");

  // Verify all client tables are properly defined with expected names
  assert.strictEqual(getTableName(cartTable), "client_carts", "Cart table name mismatch");
  assert.strictEqual(getTableName(cartItemsTable), "client_cart_items", "Cart items table name mismatch");
  assert.strictEqual(getTableName(userAddressesTable), "user_addresses", "User addresses table name mismatch");
  assert.strictEqual(getTableName(wishlistTable), "client_wishlists", "Wishlist table name mismatch");
  assert.strictEqual(getTableName(clientHeroBannersTable), "client_hero_banners", "Hero banners table name mismatch");
  assert.strictEqual(getTableName(clientSearchHistoryTable), "client_search_history", "Search history table name mismatch");
  assert.strictEqual(getTableName(clientRecentlyViewedTable), "client_recently_viewed", "Recently viewed table name mismatch");
  assert.strictEqual(getTableName(clientLoyaltyAccountsTable), "client_loyalty_accounts", "Loyalty accounts table name mismatch");

  // Verify column existence on hero banners
  assert.ok(clientHeroBannersTable.name, "Hero banner name column exists");
  assert.ok(clientHeroBannersTable.image, "Hero banner image column exists");
  assert.ok(clientHeroBannersTable.displayOrder, "Hero banner displayOrder column exists");
  assert.ok(clientHeroBannersTable.isActive, "Hero banner isActive column exists");

  // Verify column existence on search history
  assert.ok(clientSearchHistoryTable.userId, "Search history userId column exists");
  assert.ok(clientSearchHistoryTable.query, "Search history query column exists");
  assert.ok(clientSearchHistoryTable.searchCount, "Search history searchCount column exists");

  // Verify column existence on recently viewed
  assert.ok(clientRecentlyViewedTable.userId, "Recently viewed userId column exists");
  assert.ok(clientRecentlyViewedTable.productId, "Recently viewed productId column exists");
  assert.ok(clientRecentlyViewedTable.viewedAt, "Recently viewed viewedAt column exists");

  // Verify column existence on loyalty accounts
  assert.ok(clientLoyaltyAccountsTable.userId, "Loyalty accounts userId column exists");
  assert.ok(clientLoyaltyAccountsTable.pointsBalance, "Loyalty accounts pointsBalance column exists");
  assert.ok(clientLoyaltyAccountsTable.tier, "Loyalty accounts tier column exists");

  console.log("✓ All Client Schemas passed validation successfully.");
}

testClientSchemas().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
