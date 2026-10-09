import assert from "node:assert";
import crypto from "node:crypto";
import { db } from "../../db/db";
import { usersTable } from "../../db/db/schema/users";
import { clientHeroBannersTable } from "../../db/db/schema/client/hero-banners";
import { clientSearchHistoryTable } from "../../db/db/schema/client/search-history";
import { eq } from "drizzle-orm";
import { HeroBannerService } from "../client-modules/home/services/hero-banner-service";
import { SearchService } from "../client-modules/home/services/search-service";
import {
  getTrendingProducts,
  getNewArrivals,
  getTopRated,
} from "../client-modules/home/services/recommendationServices";

async function runPhase4Tests() {
  console.log("--> Running Phase 4 Tests: Storefront Search, Hero Banners & Recommendations (Live DB)...");

  const testSuffix = Date.now();
  const testBannerId = crypto.randomUUID();
  const testUserId = crypto.randomUUID();
  const testEmail = `phase4-test-${testSuffix}@needlon-test.com`;

  // 1. Test HeroBannerService with live DB banner
  console.log("1. Setting up temporary hero banner in database...");
  await db.insert(clientHeroBannersTable).values({
    id: testBannerId,
    name: `Festive Luxury Edit ${testSuffix}`,
    description: "Exclusive festive season collection with handcrafted embroidery.",
    image: "https://images.unsplash.com/photo-banner-test.jpg",
    offer: "UP TO 50% OFF",
    slug: `festive-edit-${testSuffix}`,
    displayOrder: 1,
    isActive: true,
  });

  try {
    const banners = await HeroBannerService.getActiveHeroBanners();
    assert.ok(Array.isArray(banners), "Hero banners should be an array");
    const foundBanner = banners.find((b) => b.id === testBannerId);
    assert.ok(foundBanner, "Inserted hero banner should be retrieved");
    assert.strictEqual(foundBanner?.name, `Festive Luxury Edit ${testSuffix}`);
    assert.strictEqual(foundBanner?.offer, "UP TO 50% OFF");
    console.log("✓ HeroBannerService live retrieval verified.");
  } finally {
    await db.delete(clientHeroBannersTable).where(eq(clientHeroBannersTable.id, testBannerId));
    console.log("✓ Hero banner cleaned up.");
  }

  // 2. Test SearchService with live user and search history
  console.log("2. Setting up temporary test user for search history...");
  await db.insert(usersTable).values({
    id: testUserId,
    name: "Search Tester",
    email: testEmail,
    number: "+919876543210",
  });

  try {
    console.log("3. Testing SearchService.searchStorefront with query logging...");
    const searchRes = await SearchService.searchStorefront("Cotton", testUserId);
    assert.ok(searchRes && typeof searchRes === "object", "Search result should be a grouped object");
    console.log("✓ Storefront search executed successfully.");

    // Verify search history record was created
    const historyRows = await db
      .select()
      .from(clientSearchHistoryTable)
      .where(eq(clientSearchHistoryTable.userId, testUserId));

    assert.ok(historyRows.length >= 1, "Search history should log query for user");
    assert.strictEqual(historyRows[0].query, "Cotton");
    assert.ok(historyRows[0].searchCount >= 1);
    console.log("✓ Search history logged in client_search_history.");

    // 4. Test SearchService.getSuggestions
    console.log("4. Testing SearchService.getSuggestions...");
    const suggestions = await SearchService.getSuggestions(testUserId);
    assert.ok(suggestions, "Suggestions object returned");
    assert.ok(Array.isArray(suggestions.recent), "Recent should be array");
    assert.ok(suggestions.recent.includes("Cotton"), "Recent searches should contain 'Cotton'");
    assert.ok(Array.isArray(suggestions.suggested), "Suggested should be array");
    assert.ok(suggestions.suggested.length > 0, "Suggested items should not be empty");
    console.log(`✓ Suggestions verified (recent: ${suggestions.recent.length}, suggested: ${suggestions.suggested.length}).`);

    // 5. Test SearchService.getSubCatSearchItems
    console.log("5. Testing SearchService.getSubCatSearchItems...");
    const subCatItems = await SearchService.getSubCatSearchItems();
    assert.ok(Array.isArray(subCatItems), "Sub-category items should be array");
    assert.ok(subCatItems.length > 0, "Sub-category items should not be empty");
    assert.ok(subCatItems[0].name && subCatItems[0].slug, "Item should have name and slug");
    console.log("✓ Sub-category search items verified.");

    // 6. Test recommendation services
    console.log("6. Testing recommendation services...");
    const [trending, newArrivals, topRated] = await Promise.all([
      getTrendingProducts(),
      getNewArrivals(6),
      getTopRated(6),
    ]);

    assert.ok(Array.isArray(trending) && trending.length > 0, "Trending products returned");
    assert.ok(Array.isArray(newArrivals) && newArrivals.length > 0, "New arrivals returned");
    assert.ok(Array.isArray(topRated) && topRated.length > 0, "Top rated returned");
    assert.ok(trending[0].name && trending[0].price !== undefined, "Product card shape valid");
    console.log("✓ Recommendation services verified.");

  } finally {
    console.log("7. Cleaning up search history and test user...");
    await db.delete(clientSearchHistoryTable).where(eq(clientSearchHistoryTable.userId, testUserId));
    await db.delete(usersTable).where(eq(usersTable.id, testUserId));
    console.log("✓ Test user and search history cleaned up.");
  }

  console.log("=== All Phase 4 Tests Passed Successfully! ===");
  process.exit(0);
}

runPhase4Tests().catch((err) => {
  console.error("Phase 4 test failed:", err);
  process.exit(1);
});
