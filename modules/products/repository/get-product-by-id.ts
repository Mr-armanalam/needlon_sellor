import {AuthSeller} from "@/types/auth";
import {NotFoundError} from "@/modules/shared/errors";
import {ForbiddenError} from "@/modules/shared/errors/forbidden-error";
import { db } from "@/db";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { shippingTable } from "@/db/schema/catalog/products/shipping/table";
import { productSeoTable } from "@/db/schema/catalog/products/product-seo/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { eq } from "drizzle-orm";

export const getProductById = async (productId:string, seller:AuthSeller) => {
    // Fetch master product
    const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, productId))
        .limit(1);

    if (!product) {
        return new NotFoundError("Product not found" );
    }

    if (product.storeId !== seller.id && seller.role !== "admin") {
        return new ForbiddenError("Forbidden: Access denied to this product." );
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

    return data;
}
