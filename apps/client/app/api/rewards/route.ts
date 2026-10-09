import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { RewardService } from "@/modules/account/services/reward-service";

export const GET = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? "mock-user";

    const data = await RewardService.getBuyerRewards(userId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("REWARDS_GET_ERROR:", error);
    return NextResponse.json({ rewards: [] }, { status: 200 });
  }
};
