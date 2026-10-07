import { db } from "@/db";
import { coupons } from "@/db/schema/coupons";
import { generateCouponCode } from "./generate-coupon";

export async function createCouponForUser({
  prefix,
  type,
  value,
  userId,
}: {
  prefix?: string;
  type: "PERCENT" | "FLAT";
  value: number;
  userId?: string; // optional, if user-specific
}) {
  const code = generateCouponCode(8, prefix);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 10); // 10 days from now

  const [coupon] = await db.insert(coupons).values({
    code,
    type,
    value,
    userId,
    maxUses: 1,
    expiresAt,
  }).returning();

  return coupon;
}
