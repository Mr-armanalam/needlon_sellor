'use server'
import { db } from "@/db";
import { coupons } from "@/db/schema/coupons";
import { eq, gt, lte, and } from "drizzle-orm";

export async function validateCoupon({ code }: { code: string; userId: string }) {
  const now = new Date();

  const [coupon] = await db.select().from(coupons).where(
    and(
      eq(coupons.code, code),
      eq(coupons.isActive, true),
      gt(coupons.expiresAt, now),
      lte(coupons.usedCount, 0),
      // or(
      //   isNull(coupons.userId),
      //   eq(coupons.userId, userId)
      // )
    )
  )

  if (!coupon) {
    return { valid: false, message: "Invalid, expired, or already used coupon" };
  }

  return { valid: true, coupon };
}
