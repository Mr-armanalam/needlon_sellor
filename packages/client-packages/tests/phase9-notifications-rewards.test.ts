import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { notifications } from "@needlon/db/db/schema/notifications/notification-events";
import { clientLoyaltyAccountsTable } from "@needlon/db/db/schema/client/loyalty";
import { promotions } from "@needlon/db/db/schema/marketing/promotion";
import { seller } from "@needlon/db/db/schema/seller";
import { NotificationService } from "../client-modules/notification/services/notification-service";
import { RewardService } from "../client-modules/account/services/reward-service";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runPhase9Tests() {
  console.log("--> Starting Phase 9: In-App Notifications & Buyer Rewards Test...");

  const testBuyerId = randomUUID();
  let testNotifId1: string | undefined;
  let testNotifId2: string | undefined;
  let testPromoId: string | undefined;

  try {
    // 1. Setup Test Buyer
    console.log("1. Creating test buyer user...");
    await db.insert(usersTable).values({
      id: testBuyerId,
      name: "Notification & Rewards Tester",
      email: `notif-tester-${Date.now()}@example.com`,
    });

    // 2. Seed Buyer In-App Notifications
    console.log("2. Seeding in-app notifications in notifications table...");
    const [notif1, notif2] = await db
      .insert(notifications)
      .values([
        {
          recipientType: "BUYER",
          recipientId: testBuyerId,
          notificationType: "ORDER_STATUS",
          title: "Order Shipped!",
          message: "Your bespoke trousers have been dispatched.",
          priority: "NORMAL",
          isRead: false,
        },
        {
          recipientType: "BUYER",
          recipientId: testBuyerId,
          notificationType: "PROMOTION",
          title: "VIP Weekend 20% OFF",
          message: "Use code VIP20 at checkout for weekend savings.",
          priority: "HIGH",
          isRead: false,
        },
      ])
      .returning();

    testNotifId1 = notif1.id;
    testNotifId2 = notif2.id;
    console.log(`✓ Seeded notifications: ${testNotifId1}, ${testNotifId2}`);

    // 3. Test Notification Query via NotificationService
    console.log("3. Querying buyer notifications via NotificationService...");
    const userNotifs = await NotificationService.getBuyerNotifications(testBuyerId);
    assert.strictEqual(userNotifs.length, 2, "Buyer should have 2 notifications");
    assert.strictEqual(userNotifs[0].read, false, "Initial notification must be unread");
    console.log("✓ Notification query verified.");

    // 4. Test Mark Single Notification as Read
    console.log("4. Testing single notification markAsRead...");
    await NotificationService.markNotificationAsRead(testNotifId1, testBuyerId);

    const [updatedNotif1] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, testNotifId1));
    assert.strictEqual(updatedNotif1.isRead, true, "Notification 1 should be marked as read");
    assert.ok(updatedNotif1.readAt, "readAt timestamp must be set");
    console.log("✓ Single markAsRead verified.");

    // 5. Test Mark All Notifications as Read
    console.log("5. Testing markAllNotificationsAsRead...");
    await NotificationService.markAllNotificationsAsRead(testBuyerId);

    const [updatedNotif2] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, testNotifId2));
    assert.strictEqual(updatedNotif2.isRead, true, "Notification 2 should now also be marked as read");
    console.log("✓ Mark all notifications as read verified.");

    // 6. Test Buyer Rewards & Loyalty Ledger
    console.log("6. Testing buyer rewards and loyalty ledger...");
    let [sellerRecord] = await db.select().from(seller).limit(1);
    if (!sellerRecord) {
      [sellerRecord] = await db
        .insert(seller)
        .values({
          name: "Needlon Rewards Flagship",
          email: `seller-rew-${Date.now()}@needlon.com`,
        })
        .returning();
    }

    const [promo] = await db
      .insert(promotions)
      .values({
        sellerId: sellerRecord.id,
        name: "First Order Exclusive",
        description: "Flat ₹500 off on your first tailored suit",
        promotionType: "FIRST_ORDER",
        couponCode: `FIRST500-${Date.now().toString().slice(-4)}`,
        discountType: "FIXED_AMOUNT",
        discountValue: "500.00",
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      })
      .returning();
    testPromoId = promo.id;

    // Seed loyalty points
    await db.insert(clientLoyaltyAccountsTable).values({
      userId: testBuyerId,
      pointsBalance: 650,
      tier: "GOLD",
    });

    const rewardsData = await RewardService.getBuyerRewards(testBuyerId);
    assert.ok(rewardsData.loyaltyAccount, "Loyalty account must exist");
    assert.strictEqual(rewardsData.loyaltyAccount.pointsBalance, 650, "Points balance must match");
    assert.strictEqual(rewardsData.loyaltyAccount.tier, "GOLD", "Tier must be GOLD");
    assert.ok(rewardsData.rewards.length >= 1, "Rewards list must have eligible promotions");

    const matchedPromo = rewardsData.rewards.find((r) => r.coupon_id === testPromoId);
    assert.ok(matchedPromo, "Seeded promotion must be returned in rewards list");
    assert.strictEqual(matchedPromo.title, "First Order Exclusive");
    console.log(`✓ Loyalty ledger and active rewards verified (Tier: ${rewardsData.loyaltyAccount.tier}, Balance: ${rewardsData.loyaltyAccount.pointsBalance} pts)`);

    console.log("=== Phase 9 Notifications & Rewards Tests: ALL PASSED ===");
  } finally {
    console.log("Cleaning up Phase 9 test data...");
    if (testNotifId1) {
      await db.delete(notifications).where(eq(notifications.id, testNotifId1)).catch(() => {});
    }
    if (testNotifId2) {
      await db.delete(notifications).where(eq(notifications.id, testNotifId2)).catch(() => {});
    }
    if (testPromoId) {
      await db.delete(promotions).where(eq(promotions.id, testPromoId)).catch(() => {});
    }
    await db.delete(clientLoyaltyAccountsTable).where(eq(clientLoyaltyAccountsTable.userId, testBuyerId)).catch(() => {});
    await db.delete(usersTable).where(eq(usersTable.id, testBuyerId)).catch(() => {});
    console.log("Cleanup complete.");
  }
}

runPhase9Tests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Phase 9 Test Failure:", err);
    process.exit(1);
  });
