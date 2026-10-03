import { db } from "@/db";
import { promotions } from "@/db/schema/marketing/promotion";
import { referralCodes } from "@/db/schema/marketing/referral-code";
import { and, eq, isNull, desc } from "drizzle-orm";
import { CreateCouponDto, CreateCampaignDto, CreateReferralDto } from "../dto/marketing.dto";

// --- Coupons Repository ---
export async function getSellerCouponsRepo(sellerId: string) {
  return db
    .select()
    .from(promotions)
    .where(
      and(
        eq(promotions.sellerId, sellerId),
        eq(promotions.promotionType, "COUPON"),
        isNull(promotions.deletedAt)
      )
    )
    .orderBy(desc(promotions.createdAt));
}

export async function createCouponRepo(sellerId: string, dto: CreateCouponDto) {
  const now = new Date();
  const startsAt = dto.startsAt ? new Date(dto.startsAt) : now;
  const endsAt = dto.endsAt ? new Date(dto.endsAt) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [newCoupon] = await db
    .insert(promotions)
    .values({
      sellerId,
      name: dto.name,
      promotionType: "COUPON",
      couponCode: dto.couponCode.toUpperCase(),
      discountType: dto.discountType,
      discountValue: dto.discountValue.toString(),
      minimumOrderAmount: dto.minimumOrderAmount ? dto.minimumOrderAmount.toString() : null,
      maximumDiscountAmount: dto.maximumDiscountAmount ? dto.maximumDiscountAmount.toString() : null,
      usageLimit: dto.usageLimit || null,
      usagePerBuyer: dto.usagePerBuyer || 1,
      startsAt,
      endsAt,
      status: "ACTIVE",
    })
    .returning();

  return newCoupon;
}

export async function deleteCouponRepo(sellerId: string, couponId: string) {
  const [deleted] = await db
    .update(promotions)
    .set({ deletedAt: new Date(), status: "CANCELLED" })
    .where(and(eq(promotions.id, couponId), eq(promotions.sellerId, sellerId)))
    .returning();
  return deleted;
}

// --- Campaigns Repository ---
export async function getSellerCampaignsRepo(sellerId: string) {
  const campaigns = await db
    .select()
    .from(promotions)
    .where(
      and(
        eq(promotions.sellerId, sellerId),
        eq(promotions.promotionType, "AUTOMATIC"),
        isNull(promotions.deletedAt)
      )
    )
    .orderBy(desc(promotions.createdAt));

  return campaigns;
}

export async function createCampaignRepo(sellerId: string, dto: CreateCampaignDto) {
  const now = new Date();
  const endsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const [newCampaign] = await db
    .insert(promotions)
    .values({
      sellerId,
      name: dto.name,
      description: dto.description || `Campaign via ${dto.channel}`,
      promotionType: "AUTOMATIC",
      discountType: "PERCENTAGE",
      discountValue: "10.00",
      startsAt: now,
      endsAt,
      status: "ACTIVE",
    })
    .returning();

  return newCampaign;
}

// --- Referral Repository ---
export async function getSellerReferralRepo(sellerId: string) {
  const [ref] = await db
    .select()
    .from(referralCodes)
    .where(and(eq(referralCodes.ownerId, sellerId), eq(referralCodes.ownerType, "SELLER")))
    .limit(1);

  return ref || null;
}

export async function createOrUpdateReferralRepo(sellerId: string, dto: CreateReferralDto) {
  const existing = await getSellerReferralRepo(sellerId);

  if (existing) {
    const [updated] = await db
      .update(referralCodes)
      .set({
        referralCode: dto.referralCode.toUpperCase(),
        campaignName: dto.campaignName,
        description: dto.description,
        maxUsageLimit: dto.maxUsageLimit || null,
        updatedAt: new Date(),
      })
      .where(eq(referralCodes.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(referralCodes)
    .values({
      ownerType: "SELLER",
      ownerId: sellerId,
      campaignName: dto.campaignName,
      referralCode: dto.referralCode.toUpperCase(),
      description: dto.description,
      maxUsageLimit: dto.maxUsageLimit || null,
      status: "ACTIVE",
    })
    .returning();

  return created;
}
