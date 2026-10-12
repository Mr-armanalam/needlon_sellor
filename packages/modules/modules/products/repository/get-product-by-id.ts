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
import { categoryAttributesTable } from "@/db/schema/catalog/category-attributes/table";
import { productAttributeValuesTable } from "@/db/schema/catalog/products/product-attribute-values/table";
import { productTagMappingsTable } from "@/db/schema/catalog/products/product-tag-mappings/table";
import { productTagsTable } from "@/db/schema/catalog/products/product-tags/table";
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

    let categoryName = "";
    if (product.categoryId) {
        const [category] = await db
            .select({ name: categoriesTable.name })
            .from(categoriesTable)
            .where(eq(categoriesTable.id, product.categoryId))
            .limit(1);
        if (category?.name) {
            categoryName = category.name;
        }
    }

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

    // Fetch Tags from mapping table
    const tagRows = await db
        .select({
            name: productTagsTable.name,
        })
        .from(productTagMappingsTable)
        .innerJoin(
            productTagsTable,
            eq(productTagMappingsTable.tagId, productTagsTable.id)
        )
        .where(eq(productTagMappingsTable.productId, productId));

    const mappingKeywords = tagRows.map(r => r.name).filter(Boolean);
    const seoKeywords = (seo?.metaKeywords as string[]) || [];
    const combinedKeywords = Array.from(new Set([...seoKeywords, ...mappingKeywords]));

    // Fetch Images
    const images = await db
        .select()
        .from(productImagesTable)
        .where(eq(productImagesTable.productId, productId));

    // Fetch Garment Specification Attributes
    const attributeRows = await db
        .select({
            key: categoryAttributesTable.attributeKey,
            value: productAttributeValuesTable.valueText,
        })
        .from(productAttributeValuesTable)
        .leftJoin(
            categoryAttributesTable,
            eq(productAttributeValuesTable.attributeId, categoryAttributesTable.id)
        )
        .where(eq(productAttributeValuesTable.productId, productId));

    const attrMap: Record<string, string> = {};
    for (const row of attributeRows) {
        if (row.key && row.value) {
            attrMap[row.key] = row.value;
        }
    }

    // Parse brandLabel & subcategory from shortDescription
    let brandLabel = "";
    let subcategory = "";
    if (product.shortDescription) {
        if (product.shortDescription.includes("Brand: ")) {
            const parts = product.shortDescription.split("|");
            for (const part of parts) {
                const trimmed = part.trim();
                if (trimmed.startsWith("Brand: ")) {
                    brandLabel = trimmed.replace("Brand: ", "").trim();
                } else if (trimmed.startsWith("Subcategory: ")) {
                    subcategory = trimmed.replace("Subcategory: ", "").trim();
                }
            }
            if (!subcategory && parts.length > 1) {
                subcategory = parts[1].trim();
            }
        } else {
            subcategory = product.shortDescription;
        }
    }

    // Parse Variant sizes & colors
    let sizesMatrix = "";
    let colorsTrack = "";
    if (variant?.name && variant.name !== "Standard Variant") {
        const parts = variant.name.split("/").map(p => p.trim());
        if (parts.length >= 2) {
            sizesMatrix = parts[0];
            colorsTrack = parts[1];
        } else if (parts.length === 1) {
            sizesMatrix = parts[0];
        }
    }

    // Extract Shipping Metadata
    const shippingMeta = (shipping?.metadata as Record<string, unknown>) || {};
    const pickupHubAddress = (shippingMeta.pickupHubAddress as string) || "";
    const deliveryRadiusRange = (shippingMeta.deliveryRadiusRange as string) || "";
    const estimatedDeliveryWindow = (shippingMeta.estimatedDeliveryWindow as string) || "";

    // Construct flat form data response
    const data = {
        id: product.id,
        name: product.name === "Untitled Draft" ? "" : product.name,
        brandLabel,
        category: categoryName,
        subcategory,
        descriptionStory: product.description || "",
        isCustomizable: product.isCustomizable ?? false,
        retailPrice: pricing?.price ? String(pricing.price) : (variant?.price ? String(variant.price) : ""),
        discountOfferRate: pricing?.compareAtPrice && pricing?.price && Number(pricing.compareAtPrice) > Number(pricing.price)
            ? String(Math.round(((Number(pricing.compareAtPrice) - Number(pricing.price)) / Number(pricing.compareAtPrice)) * 100))
            : "0",
        sizesMatrix,
        colorsTrack,
        fabricMaterial: attrMap["fabric"] || "",
        sleevesStyle: attrMap["sleeves"] || "",
        fitType: attrMap["fit"] || "",
        occasionFocus: attrMap["occasion"] || "",
        genderProfile: attrMap["gender"] || "",
        targetAgeGroup: attrMap["age_group"] || "",
        boutiqueStockCount: (product.status === "DRAFT" && (!inventory?.quantity || inventory.quantity === 0))
            ? ""
            : String(inventory?.quantity ?? ""),
        uniqueSku: (variant?.sku && !variant.sku.startsWith("sku-")) ? variant.sku : "",
        lowStockThreshold: (inventory?.lowStockThreshold && inventory.lowStockThreshold > 0) ? String(inventory.lowStockThreshold) : "",
        allowBackorder: Boolean(inventory?.allowBackorder),
        barcode: variant?.barcode || "",
        pickupHubAddress,
        packageWeight: shipping?.weight || (variant?.weightGrams ? String(variant.weightGrams / 1000) : ""),
        deliveryRadiusRange,
        estimatedDeliveryWindow,
        searchKeywords: combinedKeywords.join(", "),
        customVisibility: product.visibility || "PUBLIC",
        status: product.status,
        mediaUrls: images.map(img => img.imageUrl),
    };

    return data;
}
