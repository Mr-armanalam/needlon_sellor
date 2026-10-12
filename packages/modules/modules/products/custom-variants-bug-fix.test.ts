import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runCustomVariantsBugFixTests() {
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
  const { eq, and } = await import("drizzle-orm");

  const { DraftProductService } = await import("./services/draft-product.service");
  const { getProductById } = await import("./repository/get-product-by-id");
  const { updateVariantsSchema } = await import("./validations/variants.schema");

  console.log("🎨 Starting Custom Color & Fabric Material Bug Fix Validation Tests...\n");

  const TEST_SELLER_ID = "00000000-0000-0000-0000-000000000001";
  const sellerContext = {
    id: TEST_SELLER_ID,
    name: "Custom Variants Test Seller",
    email: "custom-variants@test.com",
  } as any;

  // 1. Ensure test seller & store exist
  const [existingSeller] = await db.select().from(sellerTable).where(eq(sellerTable.id, TEST_SELLER_ID)).limit(1);
  if (!existingSeller) {
    await db.insert(sellerTable).values({
      id: TEST_SELLER_ID,
      name: "Custom Variants Test Seller",
      email: "custom-variants@test.com",
      role: "seller",
    });
  }

  const [existingStore] = await db.select().from(sellerStoreTable).where(eq(sellerStoreTable.sellerId, TEST_SELLER_ID)).limit(1);
  if (!existingStore) {
    await db.insert(sellerStoreTable).values({
      sellerId: TEST_SELLER_ID,
      storeName: "Custom Variants Test Store",
      storeSlug: "custom-variants-store",
      status: "ACTIVE",
      visibility: "PUBLIC",
    });
  }

  const draftService = new DraftProductService();
  let draftProduct: any = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Zod Schema Validation for Custom Color Values & Color Codes
    // -------------------------------------------------------------------------
    console.log("--- TEST 1: Frontend / API Schema Validation for Custom Color & Fabric ---");
    const validCustomPayload = {
      sizesMatrix: "S, M, L",
      colorsTrack: "#FF5733",
      fabricMaterial: "100% Organic Bamboo Silk",
      sleevesStyle: "Three-Quarter Sleeve",
      fitType: "Straight Regular Fit",
    };
    const parsed = updateVariantsSchema.safeParse(validCustomPayload);
    if (!parsed.success) {
      throw new Error(`Schema validation failed on valid custom inputs: ${JSON.stringify(parsed.error)}`);
    }
    console.log("✅ Schema successfully accepted custom color hex code (#FF5733) & custom fabric material.");

    const validCustomNamePayload = {
      sizesMatrix: "Free Size",
      colorsTrack: "Lavender Mist, Champagne Gold",
      fabricMaterial: "Handloom Chanderi Tissue",
    };
    const parsedName = updateVariantsSchema.safeParse(validCustomNamePayload);
    if (!parsedName.success) {
      throw new Error(`Schema validation failed on custom color name: ${JSON.stringify(parsedName.error)}`);
    }
    console.log("✅ Schema successfully accepted custom color names & fabric material.");

    // -------------------------------------------------------------------------
    // TEST 2: Custom Hex Color Code (#FF5733) & Custom Fabric Material Persistence
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Custom Hex Color Code (#FF5733) & Custom Fabric Persistence ---");
    draftProduct = await draftService.createDraft({
      sellerId: TEST_SELLER_ID,
    } as any);
    console.log(`✅ Draft product created: ${draftProduct.id}`);

    // Update variants with hex color code and custom fabric
    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "S, M, XL",
        colorsTrack: "#FF5733",
        fabricMaterial: "100% Organic Bamboo Silk",
        sleevesStyle: "Full Sleeve",
        fitType: "A-Line Fit",
      },
      TEST_SELLER_ID
    );

    // Verify DB records in product_attribute_values
    const attrValues = await db
      .select({
        key: categoryAttributesTable.attributeKey,
        name: categoryAttributesTable.name,
        valueText: productAttributeValuesTable.valueText,
        displayValue: productAttributeValuesTable.displayValue,
      })
      .from(productAttributeValuesTable)
      .innerJoin(categoryAttributesTable, eq(productAttributeValuesTable.attributeId, categoryAttributesTable.id))
      .where(eq(productAttributeValuesTable.productId, draftProduct.id));

    const colorAttr = attrValues.find(a => a.key === "color" || a.name === "Color");
    const fabricAttr = attrValues.find(a => a.key === "fabric" || a.name === "Fabric Material");

    if (!colorAttr || colorAttr.valueText !== "#FF5733") {
      throw new Error(`Color attribute missing or mismatch in productAttributeValuesTable! Expected '#FF5733', got: ${colorAttr?.valueText}`);
    }
    console.log(`✅ Verified color in product_attribute_values: "${colorAttr.valueText}"`);

    if (!fabricAttr || fabricAttr.valueText !== "100% Organic Bamboo Silk") {
      throw new Error(`Fabric attribute missing or mismatch in productAttributeValuesTable! Expected '100% Organic Bamboo Silk', got: ${fabricAttr?.valueText}`);
    }
    console.log(`✅ Verified fabric in product_attribute_values: "${fabricAttr.valueText}"`);

    // Verify colorHex in category_attribute_options
    const [colorOpt] = await db
      .select()
      .from(categoryAttributeOptionsTable)
      .where(eq(categoryAttributeOptionsTable.value, "#FF5733"))
      .limit(1);

    if (!colorOpt || colorOpt.colorHex !== "#FF5733") {
      throw new Error(`categoryAttributeOptionsTable colorHex not set! Expected '#FF5733', got: ${colorOpt?.colorHex}`);
    }
    console.log(`✅ Verified colorHex set in category_attribute_options: "${colorOpt.colorHex}"`);

    // Verify getProductById retrieval
    let fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.colorsTrack !== "#FF5733") {
      throw new Error(`getProductById colorsTrack mismatch! Expected '#FF5733', got: "${fetched.colorsTrack}"`);
    }
    if (fetched.fabricMaterial !== "100% Organic Bamboo Silk") {
      throw new Error(`getProductById fabricMaterial mismatch! Expected '100% Organic Bamboo Silk', got: "${fetched.fabricMaterial}"`);
    }
    if (fetched.sizesMatrix !== "S, M, XL") {
      throw new Error(`getProductById sizesMatrix mismatch! Expected 'S, M, XL', got: "${fetched.sizesMatrix}"`);
    }
    console.log(`✅ getProductById successfully returned colorsTrack: "${fetched.colorsTrack}", fabricMaterial: "${fetched.fabricMaterial}", sizesMatrix: "${fetched.sizesMatrix}"`);

    // -------------------------------------------------------------------------
    // TEST 3: Edge Case - Empty sizesMatrix with Custom Color Code
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Empty sizesMatrix with Custom Color Code ---");
    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "",
        colorsTrack: "#2E8B57",
        fabricMaterial: "Pure Mulberry Silk",
      },
      TEST_SELLER_ID
    );

    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.colorsTrack !== "#2E8B57") {
      throw new Error(`Expected colorsTrack to be '#2E8B57', got: "${fetched.colorsTrack}"`);
    }
    if (fetched.sizesMatrix !== "") {
      throw new Error(`Expected sizesMatrix to be empty '', got: "${fetched.sizesMatrix}"`);
    }
    if (fetched.fabricMaterial !== "Pure Mulberry Silk") {
      throw new Error(`Expected fabricMaterial to be 'Pure Mulberry Silk', got: "${fetched.fabricMaterial}"`);
    }
    console.log(`✅ Empty sizesMatrix disambiguation succeeded: colorsTrack="${fetched.colorsTrack}", sizesMatrix="${fetched.sizesMatrix}"`);

    // -------------------------------------------------------------------------
    // TEST 4: Custom Color Names & Switching Between Standard and Custom
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Custom Color Name & Switching Between Standard and Custom ---");
    // Set custom descriptive color name
    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "M, L",
        colorsTrack: "Rose Quartz, Dusty Mint",
        fabricMaterial: "100% Raw Chanderi",
      },
      TEST_SELLER_ID
    );

    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.colorsTrack !== "Rose Quartz, Dusty Mint") {
      throw new Error(`Expected colorsTrack to be 'Rose Quartz, Dusty Mint', got: "${fetched.colorsTrack}"`);
    }
    if (fetched.fabricMaterial !== "100% Raw Chanderi") {
      throw new Error(`Expected fabricMaterial to be '100% Raw Chanderi', got: "${fetched.fabricMaterial}"`);
    }
    console.log(`✅ Custom color names accepted and retrieved: colorsTrack="${fetched.colorsTrack}", fabricMaterial="${fetched.fabricMaterial}"`);

    // Switch back to a standard color and standard fabric
    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "M, L",
        colorsTrack: "Indigo Blue",
        fabricMaterial: "Pure Silk",
      },
      TEST_SELLER_ID
    );

    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.colorsTrack !== "Indigo Blue") {
      throw new Error(`Expected colorsTrack to be 'Indigo Blue', got: "${fetched.colorsTrack}"`);
    }
    if (fetched.fabricMaterial !== "Pure Silk") {
      throw new Error(`Expected fabricMaterial to be 'Pure Silk', got: "${fetched.fabricMaterial}"`);
    }
    console.log(`✅ Successfully switched back to standard options: colorsTrack="${fetched.colorsTrack}", fabricMaterial="${fetched.fabricMaterial}"`);

    console.log("\n🎉 ALL CUSTOM COLOR AND FABRIC MATERIAL BUG FIX TESTS PASSED SUCCESSFULLY! ✅\n");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    if (draftProduct) {
      console.log("🧹 Cleaning up test product...");
      await db.delete(productVariantsTable).where(eq(productVariantsTable.productId, draftProduct.id));
      await db.delete(productAttributeValuesTable).where(eq(productAttributeValuesTable.productId, draftProduct.id));
      await db.delete(productsTable).where(eq(productsTable.id, draftProduct.id));
      console.log("✅ Cleaned up successfully.");
    }
  }
}

runCustomVariantsBugFixTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
