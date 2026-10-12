import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runBottomWearAndCustomVariantsTests() {
  const { db } = await import("../../../db/db/index");
  const { productsTable } = await import("../../../db/db/schema/catalog/products/table");
  const { productVariantsTable } = await import("../../../db/db/schema/catalog/products/product-variants/table");
  const { productAttributeValuesTable } = await import("../../../db/db/schema/catalog/products/product-attribute-values/table");
  const { productVariantOptionsTable } = await import("../../../db/db/schema/catalog/products/product-variant-options/table");
  const { categoryAttributesTable } = await import("../../../db/db/schema/catalog/category-attributes/table");
  const { categoryAttributeOptionsTable } = await import("../../../db/db/schema/catalog/category-attribute-options/table");
  const { seller: sellerTable } = await import("../../../db/db/schema/seller");
  const { sellerStore: sellerStoreTable } = await import("../../../db/db/schema/seller/seller-store");
  const { categoriesTable } = await import("../../../db/db/schema/catalog/categories/table");
  const { eq } = await import("drizzle-orm");

  const { DraftProductService } = await import("./services/draft-product.service");
  const { getProductById } = await import("./repository/get-product-by-id");
  const { updateVariantsSchema } = await import("./validations/variants.schema");
  const { isBottomWearSubcategory, SLEEVES_OPTIONS, FIT_OPTIONS } = await import("./constants");

  console.log("👖 Starting Bottom Wear Clothes, Formal Wear Fit & Custom Properties Validation Tests...\n");

  const TEST_SELLER_ID = "00000000-0000-0000-0000-000000000001";
  const sellerContext = {
    id: TEST_SELLER_ID,
    name: "Bottom Wear Test Seller",
    email: "bottom-wear@test.com",
  } as any;

  // 1. Ensure test seller & store exist
  const [existingSeller] = await db.select().from(sellerTable).where(eq(sellerTable.id, TEST_SELLER_ID)).limit(1);
  if (!existingSeller) {
    await db.insert(sellerTable).values({
      id: TEST_SELLER_ID,
      name: "Bottom Wear Test Seller",
      email: "bottom-wear@test.com",
      role: "seller",
    });
  }

  const [existingStore] = await db.select().from(sellerStoreTable).where(eq(sellerStoreTable.sellerId, TEST_SELLER_ID)).limit(1);
  if (!existingStore) {
    await db.insert(sellerStoreTable).values({
      sellerId: TEST_SELLER_ID,
      storeName: "Bottom Wear Test Store",
      storeSlug: "bottom-wear-store",
      status: "ACTIVE",
      visibility: "PUBLIC",
    });
  }

  const draftService = new DraftProductService();
  let draftProduct: any = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Bottom Wear Subcategory Detection & Options Verification
    // -------------------------------------------------------------------------
    console.log("--- TEST 1: Bottom Wear Subcategory Detection & Options List ---");
    if (!isBottomWearSubcategory("Pants")) throw new Error("Expected 'Pants' to be identified as bottom wear");
    if (!isBottomWearSubcategory("Trousers")) throw new Error("Expected 'Trousers' to be identified as bottom wear");
    if (!isBottomWearSubcategory("Skirts")) throw new Error("Expected 'Skirts' to be identified as bottom wear");
    if (!isBottomWearSubcategory("Lehanga")) throw new Error("Expected 'Lehanga' to be identified as bottom wear");
    if (isBottomWearSubcategory("Shirt")) throw new Error("Expected 'Shirt' NOT to be bottom wear");
    if (isBottomWearSubcategory("Kurta")) throw new Error("Expected 'Kurta' NOT to be bottom wear");

    if (!SLEEVES_OPTIONS.includes("None / Not Applicable")) {
      throw new Error("Expected SLEEVES_OPTIONS to include 'None / Not Applicable'");
    }
    if (!FIT_OPTIONS.includes("Tailored Fit") || !FIT_OPTIONS.includes("Classic Fit") || !FIT_OPTIONS.includes("Modern Fit")) {
      throw new Error("Expected FIT_OPTIONS to include formal wear fits: Tailored Fit, Classic Fit, Modern Fit");
    }
    console.log("✅ Verified bottom wear detection and expanded SLEEVES_OPTIONS / FIT_OPTIONS.");

    // -------------------------------------------------------------------------
    // TEST 2: Zod Schema Validation for Null / None Sleeves, Formal Fit & Custom Properties
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Zod Schema Validation for Null/None Sleeves, Formal Fits & Custom Properties ---");
    const bottomWearPayload = {
      sizesMatrix: "30, 32, 34",
      colorsTrack: "Midnight Black",
      fabricMaterial: "100% Wool Blend",
      sleevesStyle: null,
      fitType: "Tailored Fit",
      customAttributes: [
        { name: "Waist Rise", value: "Mid Rise" },
        { name: "Closure", value: "Zip Fly & Hook" },
      ],
    };
    const parsed1 = updateVariantsSchema.safeParse(bottomWearPayload);
    if (!parsed1.success) {
      throw new Error(`Schema validation failed on bottom wear payload: ${JSON.stringify(parsed1.error)}`);
    }
    console.log("✅ Schema accepted null sleevesStyle, formal 'Tailored Fit', and customAttributes array.");

    const noneSleevesPayload = {
      sleevesStyle: "None / Not Applicable",
      fitType: "Classic Fit",
      customAttributes: [
        { name: "Lapel Style", value: "Notch Lapel" },
      ],
    };
    const parsed2 = updateVariantsSchema.safeParse(noneSleevesPayload);
    if (!parsed2.success) {
      throw new Error(`Schema validation failed on 'None / Not Applicable' sleeves: ${JSON.stringify(parsed2.error)}`);
    }
    console.log("✅ Schema accepted 'None / Not Applicable' sleeves and formal 'Classic Fit'.");

    // -------------------------------------------------------------------------
    // TEST 3: Draft Persistence - Bottom Wear with Null / None Sleeves
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Database Persistence of Null / None Sleeves for Bottom Wear ---");
    draftProduct = await draftService.createDraft({
      sellerId: TEST_SELLER_ID,
    } as any);
    console.log(`✅ Draft product created: ${draftProduct.id}`);

    // Update with bottom wear info (Trousers) and None sleeves
    await draftService.updateBasicInfo(
      draftProduct.id,
      {
        name: "Italian Formal Trousers",
        category: "Mens Wear",
        subcategory: "Trousers",
      },
      TEST_SELLER_ID
    );

    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "30, 32, 34, 36",
        colorsTrack: "Charcoal Grey",
        fabricMaterial: "Worsted Wool",
        sleevesStyle: "None / Not Applicable",
        fitType: "Tailored Fit",
        customAttributes: [
          { name: "Waist Rise", value: "Mid Rise" },
          { name: "Hem Style", value: "Unfinished Hem" },
        ],
      },
      TEST_SELLER_ID
    );

    // Verify DB records in product_attribute_valuesTable
    const attrValues = await db
      .select({
        key: categoryAttributesTable.attributeKey,
        name: categoryAttributesTable.name,
        valueText: productAttributeValuesTable.valueText,
      })
      .from(productAttributeValuesTable)
      .innerJoin(categoryAttributesTable, eq(productAttributeValuesTable.attributeId, categoryAttributesTable.id))
      .where(eq(productAttributeValuesTable.productId, draftProduct.id));

    const sleevesAttr = attrValues.find(a => a.key === "sleeves" || a.name === "Sleeves Style");
    if (sleevesAttr) {
      throw new Error(`Sleeves attribute should NOT be present for bottom wear! Found: ${sleevesAttr.valueText}`);
    }
    console.log("✅ Confirmed sleevesStyle is NOT stored in product_attribute_values for bottom wear.");

    const fitAttr = attrValues.find(a => a.key === "fit" || a.name === "Fit Type");
    if (!fitAttr || fitAttr.valueText !== "Tailored Fit") {
      throw new Error(`Fit attribute expected 'Tailored Fit', got: ${fitAttr?.valueText}`);
    }
    console.log(`✅ Confirmed fitType 'Tailored Fit' stored in product_attribute_values.`);

    // -------------------------------------------------------------------------
    // TEST 4: Custom Properties Database Persistence
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Custom Properties Stored in Category & Product Schema ---");
    const waistAttr = attrValues.find(a => a.key === "waist_rise" || a.name === "Waist Rise");
    if (!waistAttr || waistAttr.valueText !== "Mid Rise") {
      throw new Error(`Custom property 'Waist Rise' missing or mismatch! Got: ${waistAttr?.valueText}`);
    }
    console.log(`✅ Confirmed custom property 'Waist Rise' -> 'Mid Rise' in product_attribute_values.`);

    const hemAttr = attrValues.find(a => a.key === "hem_style" || a.name === "Hem Style");
    if (!hemAttr || hemAttr.valueText !== "Unfinished Hem") {
      throw new Error(`Custom property 'Hem Style' missing or mismatch! Got: ${hemAttr?.valueText}`);
    }
    console.log(`✅ Confirmed custom property 'Hem Style' -> 'Unfinished Hem' in product_attribute_values.`);

    // Verify getProductById retrieval
    let fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.sleevesStyle !== "") {
      throw new Error(`Expected getProductById sleevesStyle to be empty '', got: "${fetched.sleevesStyle}"`);
    }
    if (fetched.fitType !== "Tailored Fit") {
      throw new Error(`Expected getProductById fitType to be 'Tailored Fit', got: "${fetched.fitType}"`);
    }
    if (!Array.isArray(fetched.customAttributes) || fetched.customAttributes.length < 2) {
      throw new Error(`Expected at least 2 customAttributes in getProductById, got: ${JSON.stringify(fetched.customAttributes)}`);
    }

    const fetchedWaist = fetched.customAttributes.find((a: any) => a.name === "Waist Rise");
    if (!fetchedWaist || fetchedWaist.value !== "Mid Rise") {
      throw new Error(`Expected custom attribute 'Waist Rise' with value 'Mid Rise', got: ${JSON.stringify(fetchedWaist)}`);
    }
    console.log(`✅ getProductById successfully returned empty sleevesStyle, fitType: "${fetched.fitType}", and customAttributes: ${JSON.stringify(fetched.customAttributes)}`);

    // -------------------------------------------------------------------------
    // TEST 5: Women's Bottom Wear (Skirts / Pants) with Custom Fit
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 5: Women's Bottom Wear (Skirts) with Custom Fit & Custom Properties ---");
    await draftService.updateBasicInfo(
      draftProduct.id,
      {
        name: "Pleated Midi Skirt",
        category: "Women Wear",
        subcategory: "Skirts",
      },
      TEST_SELLER_ID
    );

    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "S, M, L",
        colorsTrack: "Pastel Pink",
        fabricMaterial: "Pure Silk",
        sleevesStyle: "",
        fitType: "High-Waist A-Line Fit",
        customAttributes: [
          { name: "Length", value: "Midi Length (32 inches)" },
          { name: "Pattern", value: "Solid Pleated" },
        ],
      },
      TEST_SELLER_ID
    );

    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.sleevesStyle !== "") {
      throw new Error(`Expected sleevesStyle to be empty '', got: "${fetched.sleevesStyle}"`);
    }
    if (fetched.fitType !== "High-Waist A-Line Fit") {
      throw new Error(`Expected fitType to be 'High-Waist A-Line Fit', got: "${fetched.fitType}"`);
    }
    const lengthAttr = fetched.customAttributes.find((a: any) => a.name === "Length");
    if (!lengthAttr || lengthAttr.value !== "Midi Length (32 inches)") {
      throw new Error(`Expected Length attribute 'Midi Length (32 inches)', got: ${JSON.stringify(lengthAttr)}`);
    }
    console.log(`✅ Successfully verified Women's Skirt with custom fit "${fetched.fitType}" and custom property "${lengthAttr.name}: ${lengthAttr.value}".`);

    console.log("\n🎉 ALL BOTTOM WEAR, FORMAL FIT & CUSTOM PROPERTIES TESTS PASSED SUCCESSFULLY! ✅\n");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    if (draftProduct) {
      console.log("🧹 Cleaning up test product...");
      await db.delete(productVariantOptionsTable).where(eq(productVariantOptionsTable.variantId, draftProduct.id)).catch(() => {});
      await db.delete(productVariantsTable).where(eq(productVariantsTable.productId, draftProduct.id)).catch(() => {});
      await db.delete(productAttributeValuesTable).where(eq(productAttributeValuesTable.productId, draftProduct.id)).catch(() => {});
      await db.delete(productsTable).where(eq(productsTable.id, draftProduct.id)).catch(() => {});
      console.log("✅ Cleaned up successfully.");
    }
  }
}

runBottomWearAndCustomVariantsTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
