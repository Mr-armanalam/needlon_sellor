import { db } from "@needlon/db";
import { clientLoyaltyAccountsTable } from "@needlon/db/db/schema/client/loyalty";
import { promotions } from "@needlon/db/db/schema/marketing/promotion";
import { eq, and, inArray, desc } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

/** Honest zero state used whenever real reward data cannot be loaded:
 *  no rewards, a zero balance, and no tier — never invented figures. */
const EMPTY_REWARDS_STATE = {
  rewards: [] as never[],
  loyaltyAccount: { pointsBalance: 0, tier: null as string | null },
};

export const RewardService = {
  /**
   * Get buyer loyalty account and eligible promotions / rewards
   */
  async getBuyerRewards(userId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return EMPTY_REWARDS_STATE;
    }

    try {
      // 1. Fetch or initialize loyalty account
      let [loyaltyAccount] = await db
        .select()
        .from(clientLoyaltyAccountsTable)
        .where(eq(clientLoyaltyAccountsTable.userId, userId))
        .limit(1);

      if (!loyaltyAccount) {
        [loyaltyAccount] = await db
          .insert(clientLoyaltyAccountsTable)
          .values({
            userId,
            pointsBalance: 100, // Welcome points
            tier: "BRONZE",
          })
          .returning();
      }

      // 2. Fetch active promotions eligible for buyer rewards
      const promoRows = await db
        .select()
        .from(promotions)
        .where(
          and(
            inArray(promotions.promotionType, ["COUPON", "LOYALTY", "FIRST_ORDER"]),
            eq(promotions.status, "ACTIVE")
          )
        )
        .orderBy(desc(promotions.createdAt));

      const activeRewards = promoRows.map((p) => ({
        id: p.id,
        userId,
        coupon_id: p.id,
        title: p.name,
        description: p.description || "Special platform reward offer",
        points: Number(p.discountValue) * 10,
        status: "active",
        expiresAt: p.endsAt || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        coupon_code: p.couponCode || null,
        createdAt: p.createdAt,
      }));

      // Combine with milestone reward if points allow
      if (loyaltyAccount.pointsBalance > 0) {
        activeRewards.push({
          id: `milestone-${loyaltyAccount.id}`,
          userId,
          coupon_id: "",
          title: `${loyaltyAccount.tier} Tier Milestone Bonus`,
          description: `Current loyalty points balance: ${loyaltyAccount.pointsBalance} pts`,
          points: loyaltyAccount.pointsBalance,
          status: "active",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          coupon_code: null,
          createdAt: loyaltyAccount.updatedAt,
        });
      }

      return {
        rewards: activeRewards,
        loyaltyAccount,
      };
    } catch (error) {
      console.error("RewardService.getBuyerRewards error:", error);
      return EMPTY_REWARDS_STATE;
    }
  },
};
