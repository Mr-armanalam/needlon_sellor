import { db } from "@/db";
import { subscriptionPlans } from "@/db/schema/subscription/sucbscription-plan";
import { sellerSubscriptions } from "@/db/schema/subscription/seller-subscription";
import { subscriptionPayments } from "@/db/schema/subscription/subscription-payment";
import { subscriptionInvoices } from "@/db/schema/subscription/subscription-invoice";
import { subscriptionPlanFeatures } from "@/db/schema/subscription/subscription-plan-features";
import { and, desc, eq, isNull } from "drizzle-orm";
import {
  UpdateSubscriptionDto,
  SubscriptionPlanDto,
  SellerSubscriptionResponseDto,
  BillingLedgerResponseDto,
} from "../dto/subscription.dto";
import { SubscriptionPaymentGatewayService } from "../services/subscription-payment-gateway.service";

const DEFAULT_PLAN_BENEFITS: Record<string, string[]> = {
  FREE_TIER: [
    "Up to 25 active product listings",
    "Standard storefront layout & basic inventory tracking",
    "Standard customer review and feedback response tools",
    "Standard platform transaction commission (5.0%)",
  ],
  STARTER_PRO: [
    "Unlimited product listings & inventory tracking",
    "Advanced industrial AI image & configuration inspection modules",
    "Integrated multi-channel customer communication tools",
    "Discounted platform transaction fees on domestic & international shipping (3.5%)",
  ],
  ENTERPRISE_VIP: [
    "Unlimited listings with multi-warehouse allocation",
    "Dedicated key account manager and 24/7 priority support",
    "Automated wholesale batch order processing and invoicing",
    "Lowest marketplace commission rate across all categories (2.0%)",
  ],
};

export async function getSubscriptionPlansList(): Promise<SubscriptionPlanDto[]> {
  let plans = await db
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
          billingType: "MONTHLY",
          isPopular: true,
          displayOrder: 2,
        },
        {
          planCode: "ENTERPRISE_VIP",
          planName: "Enterprise VIP Plan",
          description: "Dedicated account manager, lowest commission, priority support.",
          price: "2499.00",
          billingType: "MONTHLY",
          displayOrder: 3,
        },
      ])
      .returning();
    plans = seeded;
  }

  // Fetch or map features
  const result: SubscriptionPlanDto[] = [];
  for (const plan of plans) {
    const dbFeatures = await db
      .select()
      .from(subscriptionPlanFeatures)
      .where(
        and(
          eq(subscriptionPlanFeatures.planId, plan.id),
          eq(subscriptionPlanFeatures.isVisible, true)
        )
      )
      .orderBy(subscriptionPlanFeatures.displayOrder);

    const features =
      dbFeatures.length > 0
        ? dbFeatures.map((f) => f.featureName)
        : DEFAULT_PLAN_BENEFITS[plan.planCode] || [
            "Unlimited product listings & inventory tracking",
            "Platform analytics & communication tools",
          ];

    const monthlyPrice = parseFloat(plan.price || "0");
    const yearlyPrice = (monthlyPrice * 10).toFixed(2); // 2 months discount on yearly

    result.push({
      id: plan.id,
      name: plan.planName,
      code: plan.planCode,
      description: plan.description || "",
      priceMonthly: monthlyPrice.toFixed(2),
      priceYearly: yearlyPrice,
      currencyCode: plan.currencyCode || "INR",
      isPopular: plan.isPopular,
      features,
    });
  }

  return result;
}

export async function getSellerCurrentSubscription(
  sellerId: string
): Promise<SellerSubscriptionResponseDto> {
  const subs = await db
    .select()
    .from(sellerSubscriptions)
    .where(eq(sellerSubscriptions.sellerId, sellerId))
    .limit(1);

  if (subs.length === 0) {
    const plans = await getSubscriptionPlansList();
    const freePlan = plans.find((p) => p.code === "FREE_TIER") || plans[0];
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const [created] = await db
      .insert(sellerSubscriptions)
      .values({
        sellerId,
        planId: freePlan.id,
        planNameSnapshot: freePlan.name,
        planPriceSnapshot: freePlan.priceMonthly,
        billingTypeSnapshot: "MONTHLY",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        autoRenew: true,
      })
      .returning();

    return {
      id: created.id,
      planId: created.planId,
      planCode: freePlan.code,
      planName: created.planNameSnapshot,
      status: created.status,
      price: created.planPriceSnapshot,
      billingType: created.billingTypeSnapshot,
      currentPeriodEnd: created.currentPeriodEnd.toISOString(),
      autoRenew: created.autoRenew,
      benefits: freePlan.features,
    };
  }

  const current = subs[0];
  const plans = await getSubscriptionPlansList();
  const matchedPlan = plans.find((p) => p.id === current.planId);
  const benefits = matchedPlan
    ? matchedPlan.features
    : DEFAULT_PLAN_BENEFITS[matchedPlan?.code || "FREE_TIER"] || DEFAULT_PLAN_BENEFITS.FREE_TIER;

  return {
    id: current.id,
    planId: current.planId,
    planCode: matchedPlan?.code || "FREE_TIER",
    planName: current.planNameSnapshot,
    status: current.status,
    price: current.planPriceSnapshot,
    billingType: current.billingTypeSnapshot,
    currentPeriodEnd: current.currentPeriodEnd.toISOString(),
    autoRenew: current.autoRenew,
    benefits,
  };
}

export async function updateSellerSubscriptionPlan(
  sellerId: string,
  dto: UpdateSubscriptionDto
) {
  const plans = await getSubscriptionPlansList();
  const targetPlan = plans.find((p) => p.id === dto.planId);
  if (!targetPlan) {
    throw new Error("Target subscription plan not found");
  }

  const now = new Date();
  const days = dto.billingCycle === "YEARLY" ? 365 : 30;
  const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const planPriceNum =
    dto.billingCycle === "YEARLY"
      ? parseFloat(targetPlan.priceYearly)
      : parseFloat(targetPlan.priceMonthly);

  // 1. If paid upgrade, process payment through Free Test Payment Gateway
  let paymentRecord: any = null;
  let invoiceRecord: any = null;

  if (planPriceNum > 0) {
    const paymentResult = await SubscriptionPaymentGatewayService.processPayment({
      sellerId,
      planId: targetPlan.id,
      planName: targetPlan.name,
      amount: planPriceNum,
      currency: "INR",
      billingCycle: dto.billingCycle,
      paymentDetails: dto.paymentDetails,
    });

    const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const currentSub = await getSellerCurrentSubscription(sellerId);

    // Insert into subscriptionPayments
    const [insertedPayment] = await db
      .insert(subscriptionPayments)
      .values({
        subscriptionId: currentSub.id,
        sellerId,
        planId: targetPlan.id,
        invoiceNumber,
        paymentGateway: paymentResult.paymentGateway,
        gatewayOrderId: paymentResult.gatewayOrderId,
        gatewayPaymentId: paymentResult.gatewayPaymentId,
        gatewayTransactionId: paymentResult.gatewayTransactionId,
        amount: planPriceNum.toFixed(2),
        currencyCode: "INR",
        netAmount: planPriceNum.toFixed(2),
        paymentMethod: paymentResult.paymentMethod,
        status: paymentResult.status,
        paidAt: paymentResult.paidAt,
        gatewayResponse: paymentResult.rawResponse,
      })
      .returning();
    paymentRecord = insertedPayment;

    // Insert into subscriptionInvoices
    const [insertedInvoice] = await db
      .insert(subscriptionInvoices)
      .values({
        invoiceNumber,
        sellerId,
        subscriptionId: currentSub.id,
        paymentId: insertedPayment.id,
        planNameSnapshot: targetPlan.name,
        billingPeriodStart: now,
        billingPeriodEnd: periodEnd,
        subtotal: planPriceNum.toFixed(2),
        totalAmount: planPriceNum.toFixed(2),
        currencyCode: "INR",
        status: "PAID",
      })
      .returning();
    invoiceRecord = insertedInvoice;
  }

  // 2. Update active subscription
  const existing = await db
    .select()
    .from(sellerSubscriptions)
    .where(eq(sellerSubscriptions.sellerId, sellerId))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(sellerSubscriptions)
      .set({
        planId: targetPlan.id,
        planNameSnapshot: targetPlan.name,
        planPriceSnapshot: planPriceNum.toFixed(2),
        billingTypeSnapshot: dto.billingCycle,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        updatedAt: now,
      })
      .where(eq(sellerSubscriptions.id, existing[0].id))
      .returning();

    return {
      success: true,
      subscription: updated,
      payment: paymentRecord,
      invoice: invoiceRecord,
    };
  }

  return { success: true };
}

export async function getSellerBillingLedger(
  sellerId: string,
  tab: "history" | "invoices"
): Promise<BillingLedgerResponseDto> {
  if (tab === "history") {
    const payments = await db
      .select({
        id: subscriptionPayments.id,
        paymentId: subscriptionPayments.gatewayPaymentId,
        amount: subscriptionPayments.amount,
        status: subscriptionPayments.status,
        paymentMethod: subscriptionPayments.paymentMethod,
        gatewayResponse: subscriptionPayments.gatewayResponse,
        paidAt: subscriptionPayments.paidAt,
        createdAt: subscriptionPayments.createdAt,
        invoiceNumber: subscriptionPayments.invoiceNumber,
      })
      .from(subscriptionPayments)
      .where(eq(subscriptionPayments.sellerId, sellerId))
      .orderBy(desc(subscriptionPayments.createdAt))
      .limit(50);

    const items = payments.map((p) => {
      const dateStr = p.paidAt || p.createdAt;
      const formattedDate = dateStr
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(dateStr))
        : "Recent";

      const cardDetails = (p.gatewayResponse as any)?.payment_method_details?.card;
      const brand = cardDetails?.brand ? cardDetails.brand.charAt(0).toUpperCase() + cardDetails.brand.slice(1) : "Visa";
      const lastDigits = cardDetails?.last4 || (p.paymentId ? p.paymentId.slice(-4) : "4242");

      return {
        id: `PAY-${lastDigits}`,
        date: formattedDate,
        method: `${brand} ending in ${lastDigits}`,
        total: `₹${parseFloat(p.amount || "0").toFixed(2)}`,
        status: p.status === "SUCCESS" ? "Succeeded" : p.status,
        invoiceId: p.invoiceNumber || undefined,
      };
    });

    return {
      tab: "history",
      items,
    };
  } else {
    const invoices = await db
      .select({
        id: subscriptionInvoices.id,
        invoiceNumber: subscriptionInvoices.invoiceNumber,
        issuedAt: subscriptionInvoices.issuedAt,
        createdAt: subscriptionInvoices.createdAt,
        billingPeriodStart: subscriptionInvoices.billingPeriodStart,
        billingPeriodEnd: subscriptionInvoices.billingPeriodEnd,
        totalAmount: subscriptionInvoices.totalAmount,
        status: subscriptionInvoices.status,
      })
      .from(subscriptionInvoices)
      .where(eq(subscriptionInvoices.sellerId, sellerId))
      .orderBy(desc(subscriptionInvoices.createdAt))
      .limit(50);

    const items = invoices.map((inv) => {
      const dateStr = inv.issuedAt || inv.createdAt;
      const formattedDate = dateStr
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(dateStr))
        : "Recent";

      const startMonth = inv.billingPeriodStart
        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
            new Date(inv.billingPeriodStart)
          )
        : "N/A";
      const endMonth = inv.billingPeriodEnd
        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
            new Date(inv.billingPeriodEnd)
          )
        : "N/A";

      return {
        id: inv.invoiceNumber,
        date: formattedDate,
        period: `${startMonth} - ${endMonth}`,
        total: `₹${parseFloat(inv.totalAmount || "0").toFixed(2)}`,
        status: inv.status === "PAID" ? "Paid" : inv.status,
        invoiceId: inv.id,
      };
    });

    return {
      tab: "invoices",
      items,
    };
  }
}

export async function getInvoicePdfData(sellerId: string, invoiceIdOrNumber: string) {
  const [invoice] = await db
    .select()
    .from(subscriptionInvoices)
    .where(
      and(
        eq(subscriptionInvoices.sellerId, sellerId),
        eq(subscriptionInvoices.invoiceNumber, invoiceIdOrNumber)
      )
    )
    .limit(1);

  if (!invoice) {
    // Try matching by UUID id
    const [byId] = await db
      .select()
      .from(subscriptionInvoices)
      .where(
        and(
          eq(subscriptionInvoices.sellerId, sellerId),
          eq(subscriptionInvoices.id, invoiceIdOrNumber)
        )
      )
      .limit(1);
    return byId || null;
  }

  return invoice;
}
