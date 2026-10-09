import { NextRequest, NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data-provider";

export const GET = async () => {
  return NextResponse.json({ notification: MOCK_NOTIFICATIONS }, { status: 200 });
};

export const PATCH = async (req: NextRequest) => {
  return NextResponse.json({ success: true }, { status: 200 });
};
