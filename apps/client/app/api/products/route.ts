import { NextRequest, NextResponse } from "next/server";
import { getMockTransformedProducts } from "@/lib/mock-data-provider";

const MOCK_TAG_DES = {
  descriptiveContent: "Explore our curated collection of premium fashion for all occasions.",
  contentTag: "New Season",
};

export async function GET(req: NextRequest) {
  return NextResponse.json({
    productData: getMockTransformedProducts(),
    productTagDes: MOCK_TAG_DES,
  });
}

export async function POST(req: Request) {
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  return new Response("Deleted successfully");
}
