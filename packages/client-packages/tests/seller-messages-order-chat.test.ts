import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { orders } from "@needlon/db/db/schema/orders/table";
import { seller } from "@needlon/db/db/schema/seller";
import { conversationsTable as conversations } from "@needlon/db/db/schema/messages/conversations/table";
import { messagesTable as messages } from "@needlon/db/db/schema/messages/messages/table";
import { chatPermissions } from "@needlon/db/db/schema/messaging/chat-permissions";
import { conversationMembersTable } from "@needlon/db/db/schema/messages/conversation-members/table";
import {
  getOrderChatDetails,
  requestOrderChatRepo,
  respondOrderChatRepo,
  sendOrderChatMessageRepo,
} from "../../modules/modules/orders/repositery/order-chat.repository";
import { createInStoreOrderRepo } from "../../modules/modules/customers/repository/customer.repository";
import { conversationService } from "../../modules/modules/message/service/conversation.service";
import { messageService } from "../../modules/modules/message/service/message.service";
import { eq, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runSellerMessagesOrderChatTest() {
  console.log("=== RUNNING SELLER MESSAGES ORDER CHAT VISIBILITY TEST ===");

  const testBuyerId = randomUUID();
  let testSellerId: string;
  let testOrderId: string | undefined;
  let testConversationId: string | undefined;

  try {
    // 1. Locate existing seller
    const [existingSeller] = await db.select().from(seller).limit(1);
    assert.ok(existingSeller, "Must have an existing seller in database");
    testSellerId = existingSeller.id;

    // 2. Create test buyer user
    const buyerName = "Test Patron " + Date.now().toString().slice(-4);
    await db.insert(usersTable).values({
      id: testBuyerId,
      name: buyerName,
      email: `patron-${Date.now()}@bespoketest.com`,
      number: "+91 9999988888",
    });
    console.log(`✓ Created test buyer: ${buyerName}`);

    // 3. Create test order via in-store order repository (sets valid store_id)
    const createdOrder = await createInStoreOrderRepo(testSellerId, {
      customerId: testBuyerId,
      garmentName: "Bespoke Navy Tuxedo",
      estimatedAmount: 18000,
      deliveryMethod: "STORE_PICKUP",
      tailoringNotes: "Custom measurements fitting",
    });
    assert.ok(createdOrder && createdOrder.id, "Order must be created");
    testOrderId = createdOrder.id;
    const orderNumber = createdOrder.orderNumber;
    console.log(`✓ Created test order: ${orderNumber}`);

    // 4. Request and accept chat permission
    await requestOrderChatRepo(testSellerId, testOrderId, "Please provide tailored measurements");
    await respondOrderChatRepo(testBuyerId, testOrderId, "ACCEPT");
    console.log("✓ Chat permission requested and accepted");

    // 5. Buyer sends message from client project
    const buyerMessageText = "Hello! My sleeve length should be 34 inches.";
    const buyerMsg = await sendOrderChatMessageRepo(
      testOrderId,
      testBuyerId,
      "BUYER",
      buyerMessageText
    );
    assert.ok(buyerMsg && buyerMsg.id, "Buyer message must be created");
    testConversationId = buyerMsg.conversationId;
    console.log(`✓ Buyer sent message: "${buyerMessageText}"`);

    // 6. Verify Seller Messages API: getSellerConversations
    const sellerConvs = await conversationService.getSellerConversations(testSellerId);
    assert.ok(sellerConvs.length > 0, "Seller conversations list must not be empty");

    const orderConv = sellerConvs.find((c) => c.id === testConversationId);
    assert.ok(orderConv, "Order conversation must be present in seller's conversations list");
    console.log("✓ Conversation found in seller inbox:", orderConv.title);

    assert.ok(
      orderConv.title?.includes(buyerName) || orderConv.title?.includes(orderNumber),
      `Conversation title should include buyer name or order number. Got: ${orderConv.title}`
    );

    assert.ok(orderConv.lastMessage, "Conversation must have lastMessage populated");
    assert.strictEqual(
      orderConv.lastMessage?.body,
      buyerMessageText,
      `Last message body must match buyer message. Got: ${orderConv.lastMessage?.body}`
    );
    assert.strictEqual(
      orderConv.lastMessage?.senderName,
      buyerName,
      `Last message senderName must match buyer name. Got: ${orderConv.lastMessage?.senderName}`
    );
    console.log("✓ Last message preview and sender display correctly on conversation item");

    // 7. Verify Message Thread for Seller: getConversationMessages
    const threadMessages = await messageService.getConversationMessages(
      testConversationId,
      testSellerId
    );
    assert.ok(threadMessages.length >= 1, "Thread must contain messages");
    const threadBuyerMsg = threadMessages.find((m) => m.id === buyerMsg.id);
    assert.ok(threadBuyerMsg, "Buyer message must be in the seller conversation thread");
    assert.strictEqual(threadBuyerMsg.body, buyerMessageText);
    assert.strictEqual(threadBuyerMsg.isOwnMessage, false);
    assert.strictEqual(threadBuyerMsg.sender.name, buyerName);
    console.log("✓ Buyer message correctly loaded in seller chat thread with sender name and text");

    // 8. Seller sends reply via messageService (seller project messages page)
    const sellerReplyText = "Got it! We have updated your sleeve length to 34 inches.";
    const sellerReply = await messageService.sendMessage(
      {
        conversationId: testConversationId,
        messageType: "TEXT",
        body: sellerReplyText,
      },
      testSellerId
    );
    assert.ok(sellerReply && sellerReply.id, "Seller reply must be created");
    console.log(`✓ Seller replied from seller messages page: "${sellerReplyText}"`);

    // 9. Verify Buyer sees the seller reply via getOrderChatDetails
    const buyerChatDetails = await getOrderChatDetails(testOrderId, "BUYER", testBuyerId);
    assert.ok(buyerChatDetails.messages.length >= 2, "Buyer should see both messages");
    const buyerReceivedReply = buyerChatDetails.messages.find((m) => m.id === sellerReply.id);
    assert.ok(buyerReceivedReply, "Buyer order chat must receive the seller reply");
    assert.strictEqual(buyerReceivedReply.content, sellerReplyText);
    assert.strictEqual(buyerReceivedReply.senderType, "SELLER");
    console.log("✓ Buyer order chat received seller reply seamlessly");

    // 10. Verify seller conversation list updated with new last message
    const updatedSellerConvs = await conversationService.getSellerConversations(testSellerId);
    const updatedOrderConv = updatedSellerConvs.find((c) => c.id === testConversationId);
    assert.strictEqual(
      updatedOrderConv?.lastMessage?.body,
      sellerReplyText,
      "Last message in seller conversation list must now be the seller reply"
    );
    console.log("✓ Seller conversation list updated with latest reply");

    console.log("=== ALL SELLER MESSAGES ORDER CHAT TESTS PASSED SUCCESSFULLY! ===");
  } finally {
    // Cleanup
    if (testConversationId) {
      await db.delete(messages).where(eq(messages.conversationId, testConversationId));
      await db
        .delete(conversationMembersTable)
        .where(eq(conversationMembersTable.conversationId, testConversationId));
      await db.delete(conversations).where(eq(conversations.id, testConversationId));
    }
    if (testOrderId) {
      await db.delete(chatPermissions).where(eq(chatPermissions.orderId, testOrderId));
      await db.delete(orders).where(eq(orders.id, testOrderId));
    }
    if (testBuyerId) {
      await db.delete(usersTable).where(eq(usersTable.id, testBuyerId));
    }
    console.log("✓ Test cleanup completed.");
  }
}

runSellerMessagesOrderChatTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
