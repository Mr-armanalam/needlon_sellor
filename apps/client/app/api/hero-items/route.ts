/* eslint-disable @typescript-eslint/no-explicit-any */
import { MOCK_HERO_ITEMS } from "@/lib/mock-data-provider";

export async function POST(req: Request) {
  return Response.json({ success: true }, { status: 200 });
}

export async function GET() {
  return Response.json({ success: true, items: MOCK_HERO_ITEMS }, { status: 200 });
}

