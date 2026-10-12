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
            name: categoryAttributesTable.name,
            value: productAttributeValuesTable.valueText,
            displayValue: productAttributeValuesTable.displayValue,
        })
        .from(productAttributeValuesTable)
        .leftJoin(
            categoryAttributesTable,
            eq(productAttributeValuesTable.attributeId, categoryAttributesTable.id)
        )
        .where(eq(productAttributeValuesTable.productId, productId));

    const STANDARD_KEYS = new Set([
        "fabric", "fabric_material", "fabric material",
        "sleeves", "sleeves_style", "sleeves style",
        "fit", "fit_type", "fit type", "women_fit", "mens_fit",
        "occasion", "occasion_focus", "occasion focus",
        "gender", "gender_profile", "gender profile",
        "age_group", "target_age_group", "target age group",
        "color", "color track", "colors_track", "colors track",
        "size", "sizes", "sizes_matrix", "sizes matrix"
    ]);

    const attrMap: Record<string, string> = {};
    const customAttributes: Array<{ name: string; value: string }> = [];
    for (const row of attributeRows) {
        const val = row.value || row.displayValue || "";
        if (row.key && val) {
            attrMap[row.key.toLowerCase()] = val;
        }
        if (row.name && val) {
            attrMap[row.name.toLowerCase()] = val;
        }
        const k = (row.key || "").toLowerCase();
        const n = (row.name || "").toLowerCase();
        if (!STANDARD_KEYS.has(k) && !STANDARD_KEYS.has(n) && val) {
            customAttributes.push({
                name: row.name || row.key || "Property",
                value: val,
            });
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

    // Check subcategory by foreign key if available
    if (product.subcategoryId) {
        const [subCat] = await db
            .select({ name: categoriesTable.name })
            .from(categoriesTable)
            .where(eq(categoriesTable.id, product.subcategoryId))
            .limit(1);
        if (subCat?.name) {
            subcategory = subCat.name;
        }
    }

    // Parse Variant sizes & colors
    let sizesMatrix = "";
    let colorsTrack = "";
    const colorFromAttr = attrMap["color"] || attrMap["color track"] || attrMap["colors_track"] || attrMap["colors track"] || "";
    const sizeFromAttr = attrMap["size"] || attrMap["sizes"] || attrMap["sizes_matrix"] || attrMap["sizes matrix"] || "";

    if (variant?.name && variant.name !== "Standard Variant") {
        const delimiter = variant.name.includes(" - ") ? " - " : (variant.name.includes("/") ? "/" : null);
        if (delimiter) {
            const parts = variant.name.split(delimiter).map(p => p.trim());
            if (parts.length >= 2) {
                sizesMatrix = parts[0];
                colorsTrack = parts.slice(1).join(" - ");
            } else if (parts.length === 1) {
                if (colorFromAttr && parts[0] === colorFromAttr) {
                    colorsTrack = parts[0];
                } else {
                    sizesMatrix = parts[0];
                }
            }
        } else {
            if (colorFromAttr && variant.name === colorFromAttr) {
                colorsTrack = variant.name;
            } else {
                sizesMatrix = variant.name;
            }
        }
    }

    if (!colorsTrack && colorFromAttr) {
        colorsTrack = colorFromAttr;
    }
    if (!sizesMatrix && sizeFromAttr) {
        sizesMatrix = sizeFromAttr;
    }

    // Extract Shipping Metadata
    const shippingMeta = (shipping?.metadata as Record<string, unknown>) || {};
    const pickupHubAddress = (shippingMeta.pickupHubAddress as string) || "";
    const deliveryRadiusRange = (shippingMeta.deliveryRadiusRange as string) || "";
    const estimatedDeliveryWindow = variant?.estimatedDeliveryWindow || (shippingMeta.estimatedDeliveryWindow as string) || "";

    // Safe stable discount calculation
    let discountOfferRate = "0";
    if (pricing?.discountRate !== undefined && pricing?.discountRate !== null) {
        discountOfferRate = String(pricing.discountRate);
    } else if (pricing?.compareAtPrice && pricing?.price && Number(pricing.compareAtPrice) > Number(pricing.price)) {
        discountOfferRate = String(Math.round(((Number(pricing.compareAtPrice) - Number(pricing.price)) / Number(pricing.compareAtPrice)) * 100));
    }

    // Construct comprehensive form data response
    const data = {
        id: product.id,
        name: product.name === "Untitled Draft" ? "" : product.name,
        brandLabel: product.brandName || brandLabel,
        brandId: product.brandId || null,
        brandName: product.brandName || "",
        category: categoryName,
        categoryId: product.categoryId,
        subcategory,
        subcategoryId: product.subcategoryId || null,
        descriptionStory: product.description || "",
        isCustomizable: product.isCustomizable ?? true,
        currencyCode: pricing?.currencyCode || "INR",
        retailPrice: pricing?.price ? String(pricing.price) : "",
        discountOfferRate,
        compareAtPrice: pricing?.compareAtPrice ? String(pricing.compareAtPrice) : "",
        costPrice: pricing?.costPrice ? String(pricing.costPrice) : "",
        minimumAdvertisedPrice: pricing?.minimumAdvertisedPrice ? String(pricing.minimumAdvertisedPrice) : "",
        effectiveFrom: pricing?.effectiveFrom ? pricing.effectiveFrom.toISOString().slice(0, 10) : "",
        effectiveUntil: pricing?.effectiveUntil ? pricing.effectiveUntil.toISOString().slice(0, 10) : "",
        isTaxInclusive: pricing?.isTaxInclusive ?? true,
        sizesMatrix,
        colorsTrack,
        fabricMaterial: attrMap["fabric"] || attrMap["fabric_material"] || attrMap["fabric material"] || "",
        sleevesStyle: attrMap["sleeves"] || attrMap["sleeves_style"] || attrMap["sleeves style"] || "",
        fitType: attrMap["fit"] || attrMap["fit_type"] || attrMap["fit type"] || attrMap["women_fit"] || attrMap["mens_fit"] || "",
        occasionFocus: attrMap["occasion"] || attrMap["occasion_focus"] || attrMap["occasion focus"] || "",
        genderProfile: attrMap["gender"] || attrMap["gender_profile"] || attrMap["gender profile"] || "",
        targetAgeGroup: attrMap["age_group"] || attrMap["target_age_group"] || attrMap["target age group"] || "",
        boutiqueStockCount: (product.status === "DRAFT" && (!inventory?.quantity || inventory.quantity === 0))
            ? ""
            : String(inventory?.quantity ?? ""),
        uniqueSku: (variant?.sku && !variant.sku.startsWith("sku-")) ? variant.sku : "",
        lowStockThreshold: (inventory?.lowStockThreshold && inventory.lowStockThreshold > 0) ? String(inventory.lowStockThreshold) : "",
        reservedQuantity: String(inventory?.reservedQuantity ?? 0),
        allowBackorder: Boolean(inventory?.allowBackorder),
        lastAdjustedAt: inventory?.lastAdjustedAt ? inventory.lastAdjustedAt.toISOString() : "",
        barcode: variant?.barcode || "",
        position: String(variant?.position ?? 0),
        pickupHubId: (shippingMeta.pickupHubId as string) || null,
        pickupHubAddress,
        shippingPartnerId: (shippingMeta.shippingPartnerId as string) || null,
        shippingMethodId: (shippingMeta.shippingMethodId as string) || null,
        deliveryZone: (shippingMeta.deliveryZone as string) || "DOMESTIC",
        packageWeight: (shippingMeta.packageWeight as string) || shipping?.weight || (variant?.weightGrams ? String(variant.weightGrams / 1000) : ""),
        deliveryRadiusRange: deliveryRadiusRange || "Nationwide Shipping",
        estimatedDeliveryWindow: estimatedDeliveryWindow || "3 - 5 business days delivery timeline",
        slug: seo?.slug || product.slug,
        metaTitle: seo?.metaTitle || "",
        metaDescription: seo?.metaDescription || "",
        canonicalUrl: seo?.canonicalUrl || "",
        ogTitle: seo?.ogTitle || "",
        ogDescription: seo?.ogDescription || "",
        ogImage: seo?.ogImage || null,
        twitterTitle: seo?.twitterTitle || "",
        twitterDescription: seo?.twitterDescription || "",
        twitterImage: seo?.twitterImage || null,
        searchKeywords: combinedKeywords.join(", "),
        customVisibility: product.visibility || "PUBLIC",
        status: product.status,
        mediaUrls: images.map(img => img.imageUrl),
        customAttributes,
    };

    return data;
}
