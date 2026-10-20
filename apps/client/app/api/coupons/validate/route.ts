import { NextResponse } from "next/server";
import { db } from "@needlon/db";
import { promotions } from "@needlon/db/db/schema/marketing/promotion";
import { couponRedemptions } from "@needlon/db/db/schema/marketing/coupon-redemption";
import { and, eq, isNull, sql } from "drizzle-orm";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id?: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

interface ValidateCouponRequestBody {
  code?: string;
  userId?: string;
  subtotal?: number;
}

export async function POST(req: Request) {
  try {
    const body: ValidateCouponRequestBody = await req.json().catch(() => ({}));
    const { code, userId, subtotal = 0 } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, message: "Please provide a valid coupon code" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // 1. Database Lookup against Marketing Promotions Table
    if (process.env.DATABASE_URL) {
      const [promo] = await db
        .select()
        .from(promotions)
        .where(
          and(
            eq(promotions.couponCode, normalizedCode),
            eq(promotions.status, "ACTIVE"),
            isNull(promotions.deletedAt)
          )
        )
        .limit(1);

      if (promo) {
        const now = new Date();

        // Check date validity
        if (promo.startsAt && new Date(promo.startsAt) > now) {
          return NextResponse.json(
            { valid: false, message: "This coupon is not active yet" },
            { status: 200 }
          );
        }

        if (promo.endsAt && new Date(promo.endsAt) < now) {
          return NextResponse.json(
            { valid: false, message: "This coupon code has expired" },
            { status: 200 }
          );
        }

        // Check global usage limit
        if (promo.usageLimit !== null && promo.totalRedemptions >= promo.usageLimit) {
          return NextResponse.json(
            { valid: false, message: "This coupon has reached its maximum total usage limit" },
            { status: 200 }
          );
        }

        // Check minimum order requirement
        const numSubtotal = Number(subtotal) || 0;
        if (promo.minimumOrderAmount) {
          const minRequired = Number(promo.minimumOrderAmount);
          if (numSubtotal > 0 && numSubtotal < minRequired) {
            return NextResponse.json(
              {
                valid: false,
                message: `Minimum order amount of ₹${minRequired} required for this coupon`,
              },
              { status: 200 }
            );
          }
        }

        // Check per-buyer usage limit in coupon_redemptions
        if (isValidUuid(userId)) {
          const [userRedemptionCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(couponRedemptions)
            .where(
              and(
                eq(couponRedemptions.promotionId, promo.id),
                eq(couponRedemptions.buyerId, userId!),
                eq(couponRedemptions.status, "SUCCESS")
              )
            );

          const redemptionsSoFar = userRedemptionCount?.count ?? 0;
          if (redemptionsSoFar >= promo.usagePerBuyer) {
            return NextResponse.json(
              { valid: false, message: "You have already redeemed this coupon the maximum allowed times" },
              { status: 200 }
            );
          }
        }

        // Compute discount metrics
        const isFlat = promo.discountType === "FIXED_AMOUNT";
        const rawValue = Number(promo.discountValue) || 0;
        let calculatedDiscount = 0;

        if (isFlat) {
          calculatedDiscount = numSubtotal > 0 ? Math.min(rawValue, numSubtotal) : rawValue;
        } else {
          // Percentage discount
          calculatedDiscount = numSubtotal > 0 ? Math.round((numSubtotal * rawValue) / 100) : 0;
          if (promo.maximumDiscountAmount) {
            const maxCap = Number(promo.maximumDiscountAmount);
            if (calculatedDiscount > maxCap) {
              calculatedDiscount = maxCap;
            }
          }
        }

        return NextResponse.json(
          {
            valid: true,
            coupon: {
              id: promo.id,
              code: promo.couponCode,
              name: promo.name,
              type: isFlat ? "FLAT" : "PERCENT",
              value: rawValue,
              discountAmount: calculatedDiscount,
              minimumOrderAmount: promo.minimumOrderAmount ? Number(promo.minimumOrderAmount) : null,
              maximumDiscountAmount: promo.maximumDiscountAmount ? Number(promo.maximumDiscountAmount) : null,
              usedCount: promo.totalRedemptions,
              maxUses: promo.usageLimit ?? 999999,
              expiresAt: promo.endsAt,
            },
          },
          { status: 200 }
        );
      }
    }

    // 2. Demo / Fallback Coupon Codes (When database not initialized or for demo accounts)
    const demoCoupons: Record<string, { type: "FLAT" | "PERCENT"; value: number; name: string }> = {
      SAVE10: { type: "PERCENT", value: 10, name: "10% Platform Savings" },
      SAVE20: { type: "PERCENT", value: 20, name: "20% Season Exclusive" },
      WELCOME20: { type: "PERCENT", value: 20, name: "Welcome to Needlon 20% Off" },
      FLAT500: { type: "FLAT", value: 500, name: "Flat ₹500 Luxury Credit" },
      NEEDLON100: { type: "FLAT", value: 100, name: "Bespoke Fitting Credit" },
    };

    if (demoCoupons[normalizedCode]) {
      const demo = demoCoupons[normalizedCode];
      const numSubtotal = Number(subtotal) || 0;
      const calculatedDiscount =
        demo.type === "FLAT"
          ? Math.min(demo.value, numSubtotal || demo.value)
          : numSubtotal > 0
          ? Math.round((numSubtotal * demo.value) / 100)
          : 0;

      return NextResponse.json({
        valid: true,
        coupon: {
          id: `demo-${normalizedCode.toLowerCase()}`,
          code: normalizedCode,
          name: demo.name,
          type: demo.type,
          value: demo.value,
          discountAmount: calculatedDiscount,
          usedCount: 0,
          maxUses: 100,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return NextResponse.json(
      { valid: false, message: "Invalid or inactive coupon code" },
      { status: 200 }
    );
  } catch (error) {
    console.error("COUPON_VALIDATE_ERROR:", error);
    return NextResponse.json(
      { valid: false, message: getErrorMessage(error) || "Failed to validate coupon code" },
      { status: 500 }
    );
  }
}
