import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { cartTable, cartItemsTable } from "@needlon/db/db/schema/client/cart";
import { wishlistTable } from "@needlon/db/db/schema/client/wishlist";
import { CartService } from "../client-modules/cart/services/cart-service";
import { WishlistService } from "../client-modules/account/services/wishlist-service";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runPhase5Tests() {
  console.log("--> Starting Phase 5: Cart & Wishlist Integration Test...");

  const testUserId = randomUUID();
  let testProductId: string;

  try {
    // 1. Create a temporary test user in usersTable
    console.log("1. Setting up test user...");
    await db.insert(usersTable).values({
      id: testUserId,
      name: "Cart Tester",
      email: `cart-tester-${Date.now()}@example.com`,
    });

    // 2. Find an existing product in productsTable
    console.log("2. Finding catalog product...");
    const [existingProd] = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
    if (!existingProd) {
      throw new Error("No products found in productsTable. Run seed script first.");
    }
    testProductId = existingProd.id;

    // -------------------------------------------------------------
    // CART TESTS
    // -------------------------------------------------------------
    console.log("3. Testing CartService.getCart (initial empty)...");
    const initialCart = await CartService.getCart(testUserId);
    assert.strictEqual(Array.isArray(initialCart), true, "getCart should return an array");
    assert.strictEqual(initialCart.length, 0, "Initial cart should be empty");
    console.log("✓ Initial cart is empty.");

    console.log("4. Testing CartService.addToCart (new item)...");
    const addRes1 = await CartService.addToCart(testUserId, {
      productId: testProductId,
      quantity: 2,
      size: "L",
      color: "Blue",
    });
    assert.strictEqual(addRes1.created, true, "addToCart should succeed");

    const cartAfterAdd1 = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterAdd1.length, 1, "Cart should contain 1 item");
    assert.strictEqual(cartAfterAdd1[0].productId, testProductId, "ProductId should match");
    assert.strictEqual(cartAfterAdd1[0].quantity, 2, "Quantity should be 2");
    assert.strictEqual(cartAfterAdd1[0].size, "L", "Size should be L");
    assert.ok(cartAfterAdd1[0].name, "Enriched product name should exist");
    assert.ok(typeof cartAfterAdd1[0].price === "number", "Enriched price should be numeric");
    console.log(`✓ Cart item created: ${cartAfterAdd1[0].name} (Qty: ${cartAfterAdd1[0].quantity}, ₹${cartAfterAdd1[0].price})`);

    console.log("5. Testing CartService.addToCart (increment existing item)...");
    const addRes2 = await CartService.addToCart(testUserId, {
      productId: testProductId,
      quantity: 3,
      size: "L",
    });
    assert.strictEqual(addRes2.created, true, "addToCart increment should succeed");

    const cartAfterAdd2 = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterAdd2.length, 1, "Cart should still contain 1 line item");
    assert.strictEqual(cartAfterAdd2[0].quantity, 5, "Quantity should increment to 5");
    console.log("✓ Existing cart item quantity merged to 5.");

    console.log("6. Testing CartService.removeOrDecrement...");
    const decRes = await CartService.removeOrDecrement(testUserId, testProductId, "L", 2);
    assert.strictEqual(decRes.decremented, true, "Quantity should be decremented");

    const cartAfterDec = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterDec[0].quantity, 3, "Quantity should now be 3");
    console.log("✓ Cart quantity decremented to 3.");

    console.log("7. Testing CartService.updateQuantity by item ID...");
    const itemId = cartAfterDec[0].id;
    await CartService.updateQuantity(itemId, 4);
    const cartAfterUpdate = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterUpdate[0].quantity, 4, "Quantity updated to 4");
    console.log("✓ Cart item updated to 4.");

    console.log("8. Testing CartService.syncGuestCart...");
    const guestItems = [
      { productId: testProductId, quantity: 1, size: "XL" },
    ];
    const syncedCart = await CartService.syncGuestCart(testUserId, guestItems);
    assert.strictEqual(syncedCart.length, 2, "Synced cart should now have 2 line items");
    console.log("✓ Guest cart merged successfully with 2 line items.");

    console.log("9. Testing CartService.removeFromCart...");
    await CartService.removeFromCart(itemId);
    const cartAfterRemove = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterRemove.length, 1, "Cart should have 1 item left");
    console.log("✓ Cart item removed by ID.");

    console.log("10. Testing CartService.clearCart...");
    await CartService.clearCart(testUserId);
    const cartAfterClear = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterClear.length, 0, "Cart should now be completely empty");
    console.log("✓ Cart cleared successfully.");

    // -------------------------------------------------------------
    // WISHLIST TESTS
    // -------------------------------------------------------------
    console.log("11. Testing WishlistService.getWishlist (initial empty)...");
    const initialWishlist = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(Array.isArray(initialWishlist), true, "Wishlist should return array");
    assert.strictEqual(initialWishlist.length, 0, "Initial wishlist should be empty");
    console.log("✓ Initial wishlist is empty.");

    console.log("12. Testing WishlistService.toggleWishlist (add)...");
    const toggleAdd = await WishlistService.toggleWishlist(testUserId, testProductId);
    assert.strictEqual(toggleAdd.added, true, "Item should be added to wishlist");

    const wishlistAfterAdd = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wishlistAfterAdd.length, 1, "Wishlist should contain 1 item");
    assert.strictEqual(wishlistAfterAdd[0].productId, testProductId, "Wishlist productId should match");
    assert.ok(wishlistAfterAdd[0].name, "Enriched wishlist item should have product name");
    assert.ok(typeof wishlistAfterAdd[0].price === "number", "Enriched price should be numeric");
    console.log(`✓ Wishlist item added: ${wishlistAfterAdd[0].name} (₹${wishlistAfterAdd[0].price})`);

    console.log("13. Testing WishlistService.toggleWishlist (remove)...");
    const toggleRemove = await WishlistService.toggleWishlist(testUserId, testProductId);
    assert.strictEqual(toggleRemove.added, false, "Item should be removed on second toggle");

    const wishlistAfterRemove = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wishlistAfterRemove.length, 0, "Wishlist should be empty after toggle remove");
    console.log("✓ Wishlist item toggled off.");

    console.log("14. Testing WishlistService.syncGuestWishlist...");
    const guestWishlist = [{ productId: testProductId, size: "M" }];
    const syncWlRes = await WishlistService.syncGuestWishlist(testUserId, guestWishlist);
    assert.strictEqual(syncWlRes.count, 1, "1 item should be synced");

    const wishlistAfterSync = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wishlistAfterSync.length, 1, "Wishlist should contain 1 item after sync");
    console.log("✓ Guest wishlist synced successfully.");

    console.log("15. Testing WishlistService.removeFromWishlist...");
    await WishlistService.removeFromWishlist(testUserId, testProductId);
    const wishlistFinal = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wishlistFinal.length, 0, "Wishlist should be empty after explicit remove");
    console.log("✓ Wishlist explicit removal verified.");

    console.log("=== Phase 5 Cart & Wishlist Integration Tests: ALL PASSED ===");
  } finally {
    // Cleanup test data
    console.log("Cleaning up test user data...");
    await db.delete(wishlistTable).where(eq(wishlistTable.userId, testUserId)).catch(() => {});
    const [cart] = await db.select({ id: cartTable.id }).from(cartTable).where(eq(cartTable.userId, testUserId)).catch(() => []);
    if (cart) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id)).catch(() => {});
      await db.delete(cartTable).where(eq(cartTable.id, cart.id)).catch(() => {});
    }
    await db.delete(usersTable).where(eq(usersTable.id, testUserId)).catch(() => {});
    console.log("Cleanup complete.");
  }
}

runPhase5Tests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Phase 5 Test Failure:", err);
    process.exit(1);
  });
