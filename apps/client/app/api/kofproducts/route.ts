import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/modules/product/services/kof-productServices";
import { transformToProductCard } from "@/modules/product/services/product-transformer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("type") || "trending";

    let products: any[] = [];
    if (filterType === "premium") {
      products = await ProductService.getPremium();
    } else if (filterType === "bestseller") {
      products = await ProductService.getBestSeller();
    } else if (filterType === "new-in") {
      products = await ProductService.getNewIn();
    } else {
      products = await ProductService.getTrending();
    }

    if (products && products.length > 0) {
      const productData = products.map(transformToProductCard);
      const productTagDes = {
        descriptiveContent: products[0].category?.descriptiveContent || "Explore our tailored collection.",
        contentTag: products[0].category?.contentTag || "Curated",
      };
      return NextResponse.json({ productData, productTagDes }, { status: 200 });
    }

    return NextResponse.json(
      {
        productData: [],
        productTagDes: {
          descriptiveContent: "Explore our tailored collection.",
          contentTag: "Curated",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("KOF_PRODUCTS_ERROR:", err);
    return NextResponse.json(
      {
        productData: [],
        productTagDes: {
          descriptiveContent: "",
          contentTag: "",
        },
      },
      { status: 500 }
    );
  }
}