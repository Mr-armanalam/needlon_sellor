import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { deleteProductService } from "@/modules/products/services/delete-product.service";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const { db } = await import("@/db");
    const { productsTable } = await import("@/db/schema/catalog/products/table");
    const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
    const { inventoryTable } = await import("@/db/schema/catalog/products/inventory/table");
    const { pricingTable } = await import("@/db/schema/catalog/products/pricing/table");
    const { shippingTable } = await import("@/db/schema/catalog/products/shipping/table");
    const { productSeoTable } = await import("@/db/schema/catalog/products/product-seo/table");
    const { productImagesTable } = await import("@/db/schema/catalog/products/product-images/table");
    const { categoriesTable } = await import("@/db/schema/catalog/categories/table");
    const { eq } = await import("drizzle-orm");

    const { getCurrentSeller } = await import("@/modules/auth/lib/get-current-seller");
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return successResponse({ error: "Unauthorized: You must be logged in as a seller." }, 401);
    }

    // Fetch master product
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId))
      .limit(1);

    if (!product) {
      return successResponse({ error: "Product not found" }, 404);
    }

    if (product.storeId !== seller.id && seller.role !== "admin") {
      return successResponse({ error: "Forbidden: Access denied to this product." }, 403);
    }

    const [category] = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, product.categoryId))
      .limit(1);

    // Fetch primary variant
    const [variant] = await db
      .select()
      .from(productVariantsTable)
      .where(eq(productVariantsTable.productId, productId))
      .limit(1);

    let pricing = null;
    let inventory = null;
    let shipping = null;

    if (variant) {
      [pricing] = await db
        .select()
        .from(pricingTable)
        .where(eq(pricingTable.variantId, variant.id))
        .limit(1);

      [inventory] = await db
        .select()
        .from(inventoryTable)
        .where(eq(inventoryTable.variantId, variant.id))
        .limit(1);

      [shipping] = await db
        .select()
        .from(shippingTable)
        .where(eq(shippingTable.variantId, variant.id))
        .limit(1);
    }

    // Fetch SEO
    const [seo] = await db
      .select()
      .from(productSeoTable)
      .where(eq(productSeoTable.productId, productId))
      .limit(1);

    // Fetch Images
    const images = await db
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.productId, productId));

    // Construct flat form data response
    const data = {
      id: product.id,
      name: product.name,
      brandLabel: product.shortDescription?.startsWith("Brand: ") ? product.shortDescription.replace("Brand: ", "") : "",
      category: category?.name || "Ethnic Wear",
      subcategory: product.shortDescription || "Kurtis",
      descriptionStory: product.description || "",
      retailPrice: pricing?.price || variant?.price || "0.00",
      discountOfferRate: pricing?.compareAtPrice && pricing?.price && Number(pricing.price) > 0
        ? String(Math.round(((Number(pricing.compareAtPrice) - Number(pricing.price)) / Number(pricing.price)) * 100))
        : "0",
      sizesMatrix: "Free Size",
      colorsTrack: "Default",
      fabricMaterial: "Cotton",
      boutiqueStockCount: inventory?.quantity || 0,
      uniqueSku: variant?.sku || "",
      pickupHubAddress: "Warehouse 1",
      packageWeight: shipping?.weight || "0.35",
      deliveryRadiusRange: "PAN_INDIA",
      estimatedDeliveryWindow: "3_TO_5_DAYS",
      searchKeywords: seo?.metaKeywords ? seo.metaKeywords.join(", ") : "",
      customVisibility: product.visibility || "PUBLIC",
      status: product.status,
      mediaUrls: images.map(img => img.imageUrl),
    };

    return successResponse(data);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;

    const { getCurrentSeller } = await import("@/modules/auth/lib/get-current-seller");
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      throw new Error("Unauthorized: Only authenticated sellers can delete products.");
    }

    const { getProduct } = await import("@/modules/products/repository/queries/get-product");
    const existing = await getProduct(productId);
    if (existing && existing.storeId !== seller.id && seller.role !== "admin") {
      throw new Error("Forbidden: You do not have permission to delete this product.");
    }

    const deleted = await deleteProductService(productId);
    return successResponse(deleted);
  });
}
