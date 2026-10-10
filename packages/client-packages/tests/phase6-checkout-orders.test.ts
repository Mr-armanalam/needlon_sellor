import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { userAddressesTable } from "@needlon/db/db/schema/client/user-addresses";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderAddresses } from "@needlon/db/db/schema/orders/order-address";
import { orderStatusHistory } from "@needlon/db/db/schema/orders/order-status-history/table";
import { orderPayments } from "@needlon/db/db/schema/orders/order-payments/table";
import { cartTable, cartItemsTable } from "@needlon/db/db/schema/client/cart";
import { CartService } from "../client-modules/cart/services/cart-service";
import { OrderCreationService } from "../client-modules/orders/services/order-creation-service";
import { getOrderFromDB } from "../client-modules/webhook/server/get-orderfrmdb";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runPhase6Tests() {
  console.log("--> Starting Phase 6: Checkout, Webhook & Atomic Order Creation Test...");

  const testUserId = randomUUID();
  const testAddressId = randomUUID();
  const testSessionId = `cs_test_${Date.now()}_${randomUUID().slice(0, 8)}`;
  let testProductId: string;
  let testVariantId: string | undefined;
  let initialStock = 20;

  try {
    // 1. Setup Test User
    console.log("1. Creating test user...");
    await db.insert(usersTable).values({
      id: testUserId,
      name: "Checkout Tester",
      email: `checkout-tester-${Date.now()}@example.com`,
    });

    // 2. Setup Test Address
    console.log("2. Creating test shipping address...");
    await db.insert(userAddressesTable).values({
      id: testAddressId,
      userId: testUserId,
      fullName: "Priya Sharma",
      phone: "9876543210",
      addressLine1: "Flat 402, Lotus Towers",
      addressLine2: "Cyber City",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
      isDefault: true,
    });

    // 3. Find Catalog Product & Variant
    console.log("3. Finding catalog product & checking inventory...");
    const [existingProd] = await db.select({ id: productsTable.id, name: productsTable.name }).from(productsTable).limit(1);
    if (!existingProd) {
      throw new Error("No products found in productsTable");
    }
    testProductId = existingProd.id;

    const [existingVar] = await db
      .select({ id: productVariantsTable.id })
      .from(productVariantsTable)
      .where(eq(productVariantsTable.productId, testProductId))
      .limit(1);

    if (existingVar) {
      testVariantId = existingVar.id;
      const [inv] = await db
        .select({ quantity: inventoryTable.quantity })
        .from(inventoryTable)
        .where(eq(inventoryTable.variantId, testVariantId))
        .limit(1);
      if (inv) {
        initialStock = inv.quantity;
      }
    }

    // 4. Populate User Cart
    console.log("4. Adding item to buyer's persistent cart...");
    await CartService.addToCart(testUserId, {
      productId: testProductId,
      quantity: 2,
      size: "M",
    });
    const cartBeforeCheckout = await CartService.getCart(testUserId);
    assert.strictEqual(cartBeforeCheckout.length, 1, "Cart should have 1 item before checkout");
    console.log("✓ Item added to cart.");

    // 5. Test Atomic Order Creation via OrderCreationService
    console.log("5. Executing OrderCreationService.createOrderFromCheckoutSession...");
    const orderResult = await OrderCreationService.createOrderFromCheckoutSession({
      sessionId: testSessionId,
      buyerId: testUserId,
      buyerAddressId: testAddressId,
      cartItems: [
        {
          productId: testProductId,
          quantity: 2,
          size: "M",
          price: 2499,
          name: existingProd.name,
        },
      ],
      paymentMethod: "CARD",
      paymentGateway: "STRIPE",
      currency: "INR",
    });

    assert.strictEqual(orderResult.success, true, "Order creation should succeed");
    assert.ok(orderResult.orderId, "Order ID should be returned");
    assert.ok(orderResult.orderNumber, "Order number should be generated");
    console.log(`✓ Order created: ${orderResult.orderNumber} (Grand Total: ₹${orderResult.grandTotal})`);

    // 6. Verify Root Order Record (product_orders)
    console.log("6. Verifying root order in database...");
    const [savedOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderResult.orderId))
      .limit(1);
    assert.ok(savedOrder, "Saved order must exist in product_orders");
    assert.strictEqual(savedOrder.buyerId, testUserId, "Buyer ID must match");
    assert.strictEqual(savedOrder.buyerName, "Priya Sharma", "Buyer snapshot name must match");
    assert.strictEqual(savedOrder.paymentStatus, "PAID", "Payment status must be PAID");
    console.log("✓ Root order record verified.");

    // 7. Verify Delivery Address Snapshot (order_addresses)
    console.log("7. Verifying order delivery address snapshot...");
    const [savedAddr] = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, orderResult.orderId))
      .limit(1);
    assert.ok(savedAddr, "Order address snapshot must exist");
    assert.strictEqual(savedAddr.recipientName, "Priya Sharma");
    assert.strictEqual(savedAddr.city, "Gurugram");
    assert.strictEqual(savedAddr.postalCode, "122002");
    console.log("✓ Delivery address snapshot verified.");

    // 8. Verify Order Items Snapshot (order_items)
    console.log("8. Verifying order items snapshot...");
    const savedItems = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderResult.orderId));
    assert.strictEqual(savedItems.length, 1, "There should be 1 order item");
    assert.strictEqual(savedItems[0].quantity, 2, "Quantity must be 2");
    assert.strictEqual(Number(savedItems[0].unitPrice), 2499, "Unit price snapshot must match");
    console.log("✓ Order items snapshot verified.");

    // 9. Verify Order Status History (order_status_history)
    console.log("9. Verifying audit trail in order_status_history...");
    const [savedHistory] = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderResult.orderId))
      .limit(1);
    assert.ok(savedHistory, "Status history row must exist");
    assert.strictEqual(savedHistory.action, "CREATED");
    assert.strictEqual(savedHistory.toStatus, "PENDING");
    assert.strictEqual(savedHistory.source, "WEBHOOK");
    console.log("✓ Status transition audit trail verified.");

    // 10. Verify Order Payment Record (order_payments)
    console.log("10. Verifying payment transaction in order_payments...");
    const [savedPayment] = await db
      .select()
      .from(orderPayments)
      .where(eq(orderPayments.orderId, orderResult.orderId))
      .limit(1);
    assert.ok(savedPayment, "Payment record must exist");
    assert.strictEqual(savedPayment.gatewayPaymentId, testSessionId, "Session ID must link to payment record");
    assert.strictEqual(savedPayment.paymentGateway, "STRIPE");
    console.log("✓ Order payment record verified.");

    // 11. Verify Inventory Decrement
    if (testVariantId) {
      console.log("11. Verifying inventory decrement in inventoryTable...");
      const [newInv] = await db
        .select({ quantity: inventoryTable.quantity })
        .from(inventoryTable)
        .where(eq(inventoryTable.variantId, testVariantId))
        .limit(1);
      if (newInv) {
        assert.strictEqual(
          newInv.quantity,
          Math.max(0, initialStock - 2),
          "Inventory quantity should be decremented by purchased quantity"
        );
        console.log(`✓ Inventory stock decremented: ${initialStock} -> ${newInv.quantity}`);
      }
    }

    // 12. Verify Cart Cleared
    console.log("12. Verifying user's cart is cleared after order completion...");
    const cartAfterCheckout = await CartService.getCart(testUserId);
    assert.strictEqual(cartAfterCheckout.length, 0, "Cart must be empty after order placement");
    console.log("✓ Cart cleared successfully.");

    // 13. Test getOrderFromDB for Success Page
    console.log("13. Testing getOrderFromDB using session ID...");
    const successData = await getOrderFromDB(testSessionId);
    assert.ok(successData.Payment, "Payment info must be returned");
    assert.strictEqual(successData.Payment.status, "paid", "Payment status should be paid");
    assert.strictEqual(successData.Payment.orderId, orderResult.orderNumber, "Order ID must match order number");
    assert.ok(successData.line_items.data.length > 0, "Line items data must exist");
    console.log(`✓ Success page data loaded: ${successData.Payment.orderId} (₹${successData.Payment.paymentAmount})`);

    console.log("=== Phase 6 Checkout & Order Creation Tests: ALL PASSED ===");
  } finally {
    // Cleanup test artifacts
    console.log("Cleaning up test data...");
    // Restore inventory
    if (testVariantId) {
      await db
        .update(inventoryTable)
        .set({ quantity: initialStock })
        .where(eq(inventoryTable.variantId, testVariantId))
        .catch(() => {});
    }
    // Delete test orders
    const testOrders = await db.select({ id: orders.id }).from(orders).where(eq(orders.buyerId, testUserId)).catch(() => []);
    for (const o of testOrders) {
      await db.delete(orderPayments).where(eq(orderPayments.orderId, o.id)).catch(() => {});
      await db.delete(orderStatusHistory).where(eq(orderStatusHistory.orderId, o.id)).catch(() => {});
      await db.delete(orderItems).where(eq(orderItems.orderId, o.id)).catch(() => {});
      await db.delete(orderAddresses).where(eq(orderAddresses.orderId, o.id)).catch(() => {});
      await db.delete(orders).where(eq(orders.id, o.id)).catch(() => {});
    }
    const [userCart] = await db.select({ id: cartTable.id }).from(cartTable).where(eq(cartTable.userId, testUserId)).catch(() => []);
    if (userCart) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, userCart.id)).catch(() => {});
      await db.delete(cartTable).where(eq(cartTable.id, userCart.id)).catch(() => {});
    }
    await db.delete(userAddressesTable).where(eq(userAddressesTable.userId, testUserId)).catch(() => {});
    await db.delete(usersTable).where(eq(usersTable.id, testUserId)).catch(() => {});
    console.log("Cleanup complete.");
  }
}

runPhase6Tests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Phase 6 Test Failure:", err);
    process.exit(1);
  });
