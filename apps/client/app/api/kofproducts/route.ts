import { NextRequest, NextResponse } from "next/server";
import { getMockTransformedProducts } from "@/lib/mock-data-provider";

const MOCK_TAG_DES = {
  descriptiveContent: "Explore our curated collection of premium fashion.",
  contentTag: "New Season",
};

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { productData: getMockTransformedProducts(), productTagDes: MOCK_TAG_DES },
    { status: 200 }
  );
}