import { NewProductService } from "@/modules/product/services/new-productServices";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get("category");
    const catslug = categoryParam?.toLowerCase() || "";

    //  Guard Clause for missing input
    if (!catslug) {
      return NextResponse.json(createEmptyResponse("Category is required"), { status: 400 });
    }

    // Fetch Data via Service
    const results = await NewProductService.getByCategory(catslug);

    if (results.length === 0) {
      return NextResponse.json(createEmptyResponse("No products found"));
    }

    // Transformation Layer
    const productTagDes = {
      descriptiveContent: results[0].category.descriptiveContent || "",
      contentTag: results[0].category.contentTag || results[0].category.SubCatType || "",
    };

    const productData = results.map(mapToProductDTO);

    return NextResponse.json({ productData, productTagDes });

  } catch (error) {
    console.error("CAT_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/** * Data Transfer Object (DTO) Mapper
 * Ensures consistent output structure
 */
function mapToProductDTO(r: any) {
  return {
    id: r.product.id,
    name: r.product.name,
    price: Number(r.product.price),
    image: r.product.image,
    modalImage: r.product.modalImage,
    sizes: r.product.sizes,
    category: r.category.category,
    catType: r.category.CatType,
  };
}

/** * Standardized Empty Response Helper
 */
function createEmptyResponse(message: string) {
  return {
    productData: [],
    productTagDes: {
      descriptiveContent: message,
      contentTag: "cleanSubcat",
    },
  };
}