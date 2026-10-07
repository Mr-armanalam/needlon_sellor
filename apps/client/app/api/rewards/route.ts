import { auth } from "@/auth";
import { db } from "@/db";
import { coupons } from "@/db/schema/coupons";
import { rewardSchema } from "@/db/schema/rewards";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { MOCK_REWARDS } from "@/lib/mock-data-provider";

export const GET = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ rewards: MOCK_REWARDS }, { status: 200 });
    }

    const data = await db
      .select({
        reward: rewardSchema,
        coupon_code: coupons.code,
      })
      .from(rewardSchema)
      .leftJoin(coupons, eq(rewardSchema.coupon_id, coupons.id));

    const rewards = data.length
      ? data.map((row) => ({ coupon_code: row.coupon_code, ...row.reward }))
      : MOCK_REWARDS;

    return NextResponse.json({ rewards }, { status: 200 });
  } catch (error) {
    console.warn("DB failed in rewards GET, using mock fallback:", error);
    return NextResponse.json({ rewards: MOCK_REWARDS }, { status: 200 });
  }
};
