import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/modules/product/services/product-services";
import { transformToProductCard } from "@/modules/product/services/product-transformer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryType = searchParams.get("categoryType") || searchParams.get("category") || undefined;
    const subcatSlug = searchParams.get("subcatSlug") || searchParams.get("subcategory") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const products = await ProductService.getFilteredProducts(categoryType, subcatSlug, sort);

    if (products && products.length > 0) {
      const productData = products.map(transformToProductCard);
      const productTagDes = {
        descriptiveContent: products[0].category.descriptiveContent || "Explore our tailored collection.",
        contentTag: products[0].category.contentTag || "Collection",
      };
      return NextResponse.json({ productData, productTagDes }, { status: 200 });
    }

    return NextResponse.json({
      productData: [],
      productTagDes: {
        descriptiveContent: "Explore our tailored collection.",
        contentTag: "Collection",
      },
    }, { status: 200 });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return NextResponse.json({
      productData: [],
      productTagDes: {
        descriptiveContent: "",
        contentTag: "",
      },
    }, { status: 500 });
  }
}
