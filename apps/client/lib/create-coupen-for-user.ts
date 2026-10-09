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
  userId?: string;
}) {
  const code = generateCouponCode(8, prefix);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 10);

  return {
    id: "coupon-" + Date.now(),
    code,
    type,
    value,
    userId,
    maxUses: 1,
    expiresAt,
  };
}

