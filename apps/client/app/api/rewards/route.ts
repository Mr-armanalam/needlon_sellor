import { NextResponse } from "next/server";
import { MOCK_REWARDS } from "@/lib/mock-data-provider";

export const GET = async () => {
  return NextResponse.json({ rewards: MOCK_REWARDS }, { status: 200 });
};
