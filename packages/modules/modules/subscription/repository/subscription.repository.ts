import { db } from "@/db";
import { subscriptionPlans } from "@/db/schema/subscription/sucbscription-plan";
import { sellerSubscriptions } from "@/db/schema/subscription/seller-subscription";
import { and, eq, sql } from "drizzle-orm";
import { UpdateSubscriptionDto } from "../dto/subscription.dto";

export async function getSubscriptionPlansList() {
  const plans = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, true))
    .orderBy(subscriptionPlans.displayOrder);

  if (plans.length === 0) {
    const seeded = await db
      .insert(subscriptionPlans)
      .values([
        {
          planCode: "FREE_TIER",
          planName: "Free Starter Plan",
          description: "Essential tools for new boutique sellers.",
          price: "0.00",
          billingType: "MONTHLY",
          displayOrder: 1,
        },
        {
          planCode: "STARTER_PRO",
          planName: "Pro Merchant Plan",
          description: "Advanced analytics, lower commission, unlimited listings.",
          price: "999.00",
          billingType: "YEARLY",
          isPopular: true,
          displayOrder: 2,
        },
        {
          planCode: "ENTERPRISE_VIP",
          planName: "Enterprise VIP Plan",
          description: "Dedicated account manager, lowest commission, priority support.",
          price: "2999.00",
          billingType: "YEARLY",
          displayOrder: 3,
        },
      ])
      .returning();
    return seeded;
  }

  return plans;
}

export async function getSellerCurrentSubscription(sellerId: string) {
  const subs = await db
    .select()
    .from(sellerSubscriptions)
    .where(eq(sellerSubscriptions.sellerId, sellerId))
    .limit(1);

  if (subs.length === 0) {
    const plans = await getSubscriptionPlansList();
    const freePlan = plans.find((p) => p.planCode === "FREE_TIER") || plans[0];
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const [created] = await db
      .insert(sellerSubscriptions)
      .values({
        sellerId,
        planId: freePlan.id,
        planNameSnapshot: freePlan.planName,
        planPriceSnapshot: freePlan.price,
        billingTypeSnapshot: freePlan.billingType,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        autoRenew: true,
      })
      .returning();
    return created;
  }

  return subs[0];
}

export async function updateSellerSubscriptionPlan(sellerId: string, dto: UpdateSubscriptionDto) {
  const plans = await getSubscriptionPlansList();
  const targetPlan = plans.find((p) => p.id === dto.planId);
  if (!targetPlan) {
    throw new Error("Target subscription plan not found");
  }

  const now = new Date();
  const days = dto.billingCycle === "YEARLY" ? 365 : 30;
  const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const price = targetPlan.price;

  const existing = await getSellerCurrentSubscription(sellerId);

  const [updated] = await db
    .update(sellerSubscriptions)
    .set({
      planId: targetPlan.id,
      planNameSnapshot: targetPlan.planName,
      planPriceSnapshot: price,
      billingTypeSnapshot: dto.billingCycle,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      updatedAt: now,
    })
    .where(eq(sellerSubscriptions.id, existing.id))
    .returning();

  return updated;
}
