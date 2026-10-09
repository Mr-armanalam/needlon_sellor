import { NextRequest, NextResponse } from "next/server";
import { getMockTransformedProducts } from "@/lib/mock-data-provider";
import { ProductService } from "@/modules/product/services/product-services";
import { transformToProductCard } from "@/modules/product/services/product-transformer";

const MOCK_TAG_DES = {
  descriptiveContent: "Explore our curated collection of premium fashion for all occasions.",
  contentTag: "New Season",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryType = searchParams.get("categoryType") || undefined;
    const subcatSlug = searchParams.get("subcatSlug") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const products = await ProductService.getFilteredProducts(categoryType, subcatSlug, sort);

    if (products && products.length > 0) {
      const productData = products.map(transformToProductCard);
      const productTagDes = {
        descriptiveContent: products[0].category.descriptiveContent || MOCK_TAG_DES.descriptiveContent,
        contentTag: products[0].category.contentTag || MOCK_TAG_DES.contentTag,
      };
      return NextResponse.json({ productData, productTagDes }, { status: 200 });
    }

    return NextResponse.json({
      productData: getMockTransformedProducts(),
      productTagDes: MOCK_TAG_DES,
    });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return NextResponse.json({
      productData: getMockTransformedProducts(),
      productTagDes: MOCK_TAG_DES,
    });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  return new Response("Deleted successfully");
}
