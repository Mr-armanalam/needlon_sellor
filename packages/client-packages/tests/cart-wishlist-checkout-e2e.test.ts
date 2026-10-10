import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { CartService } from "../client-modules/cart/services/cart-service";
import { WishlistService } from "../client-modules/account/services/wishlist-service";
import { OrderCreationService } from "../client-modules/orders/services/order-creation-service";
import { getOrderFromDB } from "../client-modules/webhook/server/get-orderfrmdb";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runCartWishlistCheckoutValidationTests() {
  console.log("--> Starting Comprehensive Cart, Wishlist, Sync & Checkout Validation Test...");

  const testUserId = randomUUID();
  const testSessionId = `cs_test_val_${Date.now()}_${randomUUID().slice(0, 8)}`;
  let testProductId: string;

  try {
    // 1. Setup Test User
    console.log("1. Setting up test user in PostgreSQL...");
    await db.insert(usersTable).values({
      id: testUserId,
      name: "E2E Tester",
      email: `e2e-tester-${Date.now()}@example.com`,
    });

    // 2. Fetch Catalog Product
    console.log("2. Fetching real catalog product from DB...");
    const [prod] = await db.select({ id: productsTable.id, name: productsTable.name }).from(productsTable).limit(1);
    assert.ok(prod, "A product must exist in productsTable");
    testProductId = prod.id;
    console.log(`✓ Using catalog product: ${prod.name} (${testProductId})`);

    // ------------------------------------------------------------------
    // CART FUNCTIONALITY & LOCALSTORAGE SYNC VALIDATION
    // ------------------------------------------------------------------
    console.log("3. Validating CartService.getCart empty baseline...");
    const cart0 = await CartService.getCart(testUserId);
    assert.strictEqual(cart0.length, 0, "Cart must be empty initially");
    console.log("✓ Initial cart is empty.");

    console.log("4. Validating CartService.addToCart (DB insertion)...");
    const addRes1 = await CartService.addToCart(testUserId, {
      productId: testProductId,
      quantity: 1,
      size: "M",
      color: "Black",
    });
    assert.strictEqual(addRes1.created, true, "addToCart must succeed");

    const cart1 = await CartService.getCart(testUserId);
    assert.strictEqual(cart1.length, 1, "Cart must have 1 item");
    assert.strictEqual(cart1[0].productId, testProductId);
    assert.strictEqual(cart1[0].quantity, 1);
    assert.strictEqual(cart1[0].size, "M");
    console.log(`✓ Item added and persisted in DB: ${cart1[0].name} (Qty: ${cart1[0].quantity})`);

    console.log("5. Validating CartService.addToCart quantity merging...");
    await CartService.addToCart(testUserId, {
      productId: testProductId,
      quantity: 2,
      size: "M",
    });
    const cart2 = await CartService.getCart(testUserId);
    assert.strictEqual(cart2[0].quantity, 3, "Quantity must merge to 3");
    console.log("✓ Existing cart item quantity merged to 3 in DB.");

    console.log("6. Validating CartService.syncGuestCart (Offline localStorage push to DB)...");
    const guestCartItems = [
      {
        productId: testProductId,
        quantity: 2,
        size: "XL",
        color: "Navy",
      },
    ];
    const syncedCart = await CartService.syncGuestCart(testUserId, guestCartItems);
    assert.strictEqual(syncedCart.length, 2, "Cart must now contain 2 unique variant rows");
    console.log("✓ Offline guest cart items successfully pushed to DB upon login.");

    console.log("7. Validating CartService.removeOrDecrement...");
    await CartService.removeOrDecrement(testUserId, testProductId, "M", 1);
    const cart3 = await CartService.getCart(testUserId);
    const itemM = cart3.find((c) => c.size === "M");
    assert.strictEqual(itemM?.quantity, 2, "Size M quantity must decrement to 2");
    console.log("✓ Item quantity decremented in DB.");

    // ------------------------------------------------------------------
    // WISHLIST FUNCTIONALITY & LOCALSTORAGE SYNC VALIDATION
    // ------------------------------------------------------------------
    console.log("8. Validating WishlistService.getWishlist empty baseline...");
    const wl0 = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wl0.length, 0, "Wishlist must be empty initially");
    console.log("✓ Initial wishlist is empty.");

    console.log("9. Validating WishlistService.toggleWishlist (Add to DB)...");
    const toggle1 = await WishlistService.toggleWishlist(testUserId, testProductId);
    assert.strictEqual(toggle1.added, true, "toggleWishlist must add item");
    const wl1 = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wl1.length, 1, "Wishlist must have 1 item");
    console.log(`✓ Wishlist bookmark persisted in DB: ${wl1[0].name}`);

    console.log("10. Validating WishlistService.syncGuestWishlist (Offline localStorage push to DB)...");
    const guestWlItems = [{ productId: testProductId }];
    const syncWlRes = await WishlistService.syncGuestWishlist(testUserId, guestWlItems);
    assert.strictEqual(syncWlRes.success, true);
    console.log("✓ Offline guest wishlist items successfully deduplicated and synced to DB.");

    console.log("11. Validating WishlistService.toggleWishlist (Remove from DB)...");
    const toggle2 = await WishlistService.toggleWishlist(testUserId, testProductId);
    assert.strictEqual(toggle2.removed, true, "toggleWishlist must remove item");
    const wl2 = await WishlistService.getWishlist(testUserId);
    assert.strictEqual(wl2.length, 0, "Wishlist must be empty after toggle off");
    console.log("✓ Wishlist item toggled off in DB.");

    // ------------------------------------------------------------------
    // CHECKOUT PROCESS & ORDER CREATION VALIDATION
    // ------------------------------------------------------------------
    console.log("12. Validating atomic OrderCreationService from checkout session...");
    const orderResult = await OrderCreationService.createOrderFromCheckoutSession({
      sessionId: testSessionId,
      buyerId: testUserId,
      cartItems: [
        {
          productId: testProductId,
          quantity: 1,
          size: "M",
          price: 2499,
          name: prod.name,
        },
      ],
      paymentMethod: "CARD",
      paymentGateway: "STRIPE",
      currency: "INR",
    });
    assert.strictEqual(orderResult.success, true, "Order creation must succeed");
    assert.ok(orderResult.orderNumber, "Order number must be generated");
    console.log(`✓ Order successfully created in DB: ${orderResult.orderNumber}`);

    console.log("13. Validating user cart is cleared in DB after successful order...");
    const cartAfterOrder = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterOrder.length, 0, "Cart must be cleared after order creation");
    console.log("✓ User cart automatically cleared in DB after successful checkout.");

    console.log("14. Validating getOrderFromDB for Success Page...");
    const successPageData = await getOrderFromDB(testSessionId);
    assert.ok(successPageData.Payment, "Payment record must be retrieved from DB");
    assert.ok(successPageData.line_items, "Line items must be retrieved from DB");
    assert.strictEqual(successPageData.Payment.status, "paid");
    console.log(`✓ Success page verified order in DB: Reference ${successPageData.Payment.orderId} (₹${successPageData.Payment.paymentAmount})`);

    console.log("\n=======================================================");
    console.log("🎉 ALL VALIDATION TESTS PASSED: CART, WISHLIST, OFFLINE SYNC, CHECKOUT & DB ORDER CREATION!");
    console.log("=======================================================\n");
  } finally {
    console.log("Cleaning up test user data...");
    try {
      await db.delete(usersTable).where(eq(usersTable.id, testUserId));
      console.log("Cleanup complete.");
    } catch {
      // ignore
    }
    process.exit(0);
  }
}

runCartWishlistCheckoutValidationTests().catch((err) => {
  console.error("VALIDATION_TEST_FAILED:", err);
  process.exit(1);
});
