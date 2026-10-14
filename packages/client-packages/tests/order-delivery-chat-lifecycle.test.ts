import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { seller } from "@needlon/db/db/schema/seller";
import { shipmentOrders } from "@needlon/db/db/schema/delivery/shipping-orders";
import { chatPermissions } from "@needlon/db/db/schema/messaging/chat-permissions";
import { conversations } from "@needlon/db/db/schema/messaging/conversation";
import { messages } from "@needlon/db/db/schema/messaging/messages";
import { OrderRepository } from "../client-modules/orders/repositories/order-repository";
import {
  getOrderChatDetails,
  requestOrderChatRepo,
  respondOrderChatRepo,
  sendOrderChatMessageRepo,
} from "../../modules/modules/orders/repositery/order-chat.repository";
import { createInStoreOrderRepo } from "../../modules/modules/customers/repository/customer.repository";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runOrderDeliveryChatLifecycleTests() {
  console.log("=== ORDER, DELIVERY METHOD, & ORDER-SCOPED CHAT LIFECYCLE TESTS ===");

  const testBuyerId = randomUUID();
  let testSellerId: string;
  let inStorePickupOrderId: string | undefined;
  let homeDeliveryOrderId: string | undefined;
  let testConversationId: string | undefined;

  try {
    // 1. Resolve active seller
    const [existingSeller] = await db.select().from(seller).limit(1);
    assert.ok(existingSeller, "Must have an existing seller in database");
    testSellerId = existingSeller.id;

    // 2. Create test buyer user
    await db.insert(usersTable).values({
      id: testBuyerId,
      name: "Bespoke Patron",
      email: `patron-${Date.now()}@bespokeatelier.test`,
      number: "+91 9876543210",
      role: "BUYER",
    });
    console.log("✓ Test buyer user created.");

    // 3. Test In-Store Order with STORE_PICKUP
    console.log("--> Testing in-store order with STORE_PICKUP...");
    const pickupOrder = await createInStoreOrderRepo(testSellerId, {
      customerId: testBuyerId,
      garmentName: "Bespoke Navy Tuxedo",
      estimatedAmount: 25000,
      deliveryMethod: "STORE_PICKUP",
      tailoringNotes: "Customer will collect in atelier after final fitting",
    });
    assert.ok(pickupOrder && pickupOrder.id, "Pickup order must be created");
    inStorePickupOrderId = pickupOrder.id;

    const pickupDetails = await OrderRepository.getOrderDetail(pickupOrder.id, testBuyerId);
    assert.ok(pickupDetails && pickupDetails.length > 0);
    assert.strictEqual(pickupDetails[0].isPickup, true, "isPickup must be true for store pickup");
    assert.strictEqual(pickupDetails[0].shippingAddress, null, "Shipping address must be null for store pickup");
    assert.strictEqual(pickupDetails[0].shippingCharge, 0, "Shipping charge must be 0 for store pickup");
    console.log("✓ In-store Atelier Pickup order verified with null shipping address and zero shipping charge.");

    // 4. Test In-Store Order with HOME_DELIVERY
    console.log("--> Testing in-store order with HOME_DELIVERY & partner dispatch...");
    const homeDelivOrder = await createInStoreOrderRepo(testSellerId, {
      customerId: testBuyerId,
      garmentName: "Bespoke Cashmere Overcoat",
      estimatedAmount: 45000,
      deliveryMethod: "HOME_DELIVERY",
      shippingAddress: {
        recipientName: "Bespoke Patron",
        phoneNumber: "+91 9876543210",
        addressLine1: "Suite 404, Royal Heritage",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
      tailoringNotes: "Deliver directly to residence once finished",
    });
    assert.ok(homeDelivOrder && homeDelivOrder.id, "Home delivery order must be created");
    homeDeliveryOrderId = homeDelivOrder.id;

    const homeDetails = await OrderRepository.getOrderDetail(homeDelivOrder.id, testBuyerId);
    assert.ok(homeDetails && homeDetails.length > 0);
    assert.strictEqual(homeDetails[0].isPickup, false, "isPickup must be false for home delivery");
    assert.ok(homeDetails[0].shippingAddress, "Shipping address must be present for home delivery");
    assert.strictEqual(homeDetails[0].shippingAddress?.city, "Mumbai");
    console.log("✓ In-store Home Delivery order verified with customer address snapshot.");

    // 5. Test Order Chat Handshake Flow
    console.log("--> Testing order-scoped chat permission flow...");
    // 5a. Initial state: not requested
    const initialChat = await getOrderChatDetails(homeDeliveryOrderId, "BUYER", testBuyerId);
    assert.strictEqual(initialChat.permission.status, "NOT_REQUESTED");
    assert.strictEqual(initialChat.permission.canMessage, false, "Cannot message before acceptance");

    // 5b. Seller initiates request
    const requestResult = await requestOrderChatRepo(
      testSellerId,
      homeDeliveryOrderId,
      "We need to clarify your lapel width and cuff style."
    );
    assert.strictEqual(requestResult.status, "REQUESTED");
    console.log("✓ Seller sent order-specific chat request.");

    const requestedChat = await getOrderChatDetails(homeDeliveryOrderId, "BUYER", testBuyerId);
    assert.strictEqual(requestedChat.permission.status, "REQUESTED");
    assert.ok(requestedChat.permission.requestMessage?.includes("lapel width"));
    assert.strictEqual(requestedChat.permission.canMessage, false);

    // 5c. Buyer accepts chat request
    await respondOrderChatRepo(testBuyerId, homeDeliveryOrderId, "ACCEPT");
    const acceptedChat = await getOrderChatDetails(homeDeliveryOrderId, "BUYER", testBuyerId);
    assert.strictEqual(acceptedChat.permission.status, "ACCEPTED");
    assert.strictEqual(acceptedChat.permission.canMessage, true, "Messaging unlocks after acceptance");
    testConversationId = acceptedChat.conversationId || undefined;
    console.log("✓ Buyer accepted chat request. Messaging unlocked.");

    // 5d. Message exchange
    const tailorMsg = await sendOrderChatMessageRepo(
      homeDeliveryOrderId,
      testSellerId,
      "SELLER",
      "Would you prefer peak or notch lapels for your overcoat?"
    );
    assert.ok(tailorMsg.id);
    assert.strictEqual(tailorMsg.content, "Would you prefer peak or notch lapels for your overcoat?");

    const buyerMsg = await sendOrderChatMessageRepo(
      homeDeliveryOrderId,
      testBuyerId,
      "BUYER",
      "Peak lapels with hand-stitched pick stitching, please."
    );
    assert.ok(buyerMsg.id);
    assert.strictEqual(buyerMsg.content, "Peak lapels with hand-stitched pick stitching, please.");
    console.log("✓ Order-scoped messaging exchange succeeded.");

    // 5e. Buyer privacy control: buyer can block/end chat
    await respondOrderChatRepo(testBuyerId, homeDeliveryOrderId, "BLOCK");
    const blockedChat = await getOrderChatDetails(homeDeliveryOrderId, "BUYER", testBuyerId);
    assert.strictEqual(blockedChat.permission.status, "BLOCKED");
    assert.strictEqual(blockedChat.permission.canMessage, false, "Messaging must lock when blocked by buyer");

    let blockedSendFailed = false;
    try {
      await sendOrderChatMessageRepo(homeDeliveryOrderId, testSellerId, "SELLER", "Hello?");
    } catch {
      blockedSendFailed = true;
    }
    assert.strictEqual(blockedSendFailed, true, "Message sending must fail when chat is blocked");
    console.log("✓ Buyer block/end chat privacy control verified.");

    // Unblock for next test
    await respondOrderChatRepo(testBuyerId, homeDeliveryOrderId, "UNBLOCK");
    const unblockedChat = await getOrderChatDetails(homeDeliveryOrderId, "BUYER", testBuyerId);
    assert.strictEqual(unblockedChat.permission.canMessage, true);

    // 5f. Auto-lock on DELIVERY:
    console.log("--> Testing auto-lock upon order DELIVERY...");
    await db.update(orders).set({ status: "DELIVERED" }).where(eq(orders.id, homeDeliveryOrderId));

    const deliveredChat = await getOrderChatDetails(homeDeliveryOrderId, "BUYER", testBuyerId);
    assert.strictEqual(deliveredChat.isDelivered, true);
    assert.strictEqual(deliveredChat.permission.canMessage, false, "Chat must lock automatically upon delivery");
    assert.strictEqual(deliveredChat.permission.lockReason, "DELIVERED");

    let deliveredSendFailed = false;
    try {
      await sendOrderChatMessageRepo(homeDeliveryOrderId, testBuyerId, "BUYER", "Thank you for the coat!");
    } catch (err: any) {
      deliveredSendFailed = true;
      assert.ok(err.message.includes("delivered"));
    }
    assert.strictEqual(deliveredSendFailed, true, "Sending messages after delivery must be strictly rejected");
    console.log("✓ Conversation auto-lock after delivery verified.");

    console.log("=== ALL ORDER, DELIVERY & CHAT TESTS PASSED! ===");
  } finally {
    // Cleanup
    if (homeDeliveryOrderId) {
      await db.delete(messages).where(eq(messages.relatedOrderId, homeDeliveryOrderId)).catch(() => {});
      await db.delete(conversations).where(eq(conversations.orderId, homeDeliveryOrderId)).catch(() => {});
      await db.delete(chatPermissions).where(eq(chatPermissions.orderId, homeDeliveryOrderId)).catch(() => {});
      await db.delete(shipmentOrders).where(eq(shipmentOrders.orderId, homeDeliveryOrderId)).catch(() => {});
      await db.delete(orderItems).where(eq(orderItems.orderId, homeDeliveryOrderId)).catch(() => {});
      await db.delete(orders).where(eq(orders.id, homeDeliveryOrderId)).catch(() => {});
    }
    if (inStorePickupOrderId) {
      await db.delete(orderItems).where(eq(orderItems.orderId, inStorePickupOrderId)).catch(() => {});
      await db.delete(orders).where(eq(orders.id, inStorePickupOrderId)).catch(() => {});
    }
    await db.delete(usersTable).where(eq(usersTable.id, testBuyerId)).catch(() => {});
    console.log("Cleanup complete.");
  }
}

runOrderDeliveryChatLifecycleTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
