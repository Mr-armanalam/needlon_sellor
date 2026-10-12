import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runBugFixValidationTests() {
  const { db } = await import("../../../db/db/index");
  const { productsTable } = await import("../../../db/db/schema/catalog/products/table");
  const { productVariantsTable } = await import("../../../db/db/schema/catalog/products/product-variants/table");
  const { pricingTable } = await import("../../../db/db/schema/catalog/products/pricing/table");
  const { shippingTable } = await import("../../../db/db/schema/catalog/products/shipping/table");
  const { productSeoTable } = await import("../../../db/db/schema/catalog/products/product-seo/table");
  const { productTagsTable } = await import("../../../db/db/schema/catalog/products/product-tags/table");
  const { productTagMappingsTable } = await import("../../../db/db/schema/catalog/products/product-tag-mappings/table");
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

  console.log("🔍 Starting Bug Fixes & Schema Audit Validation Tests...");

  const TEST_SELLER_ID = "00000000-0000-0000-0000-000000000001";

  // Ensure seller & store exist
  const [existingSeller] = await db.select().from(sellerTable).where(eq(sellerTable.id, TEST_SELLER_ID)).limit(1);
  if (!existingSeller) {
    await db.insert(sellerTable).values({
      id: TEST_SELLER_ID,
      name: "BugFix Test Seller",
      email: "bugfix-seller@test.com",
      role: "seller",
    });
  }

  const [existingStore] = await db.select().from(sellerStoreTable).where(eq(sellerStoreTable.sellerId, TEST_SELLER_ID)).limit(1);
  if (!existingStore) {
    await db.insert(sellerStoreTable).values({
      sellerId: TEST_SELLER_ID,
      storeName: "BugFix Store",
      storeSlug: "bugfix-store",
      status: "ACTIVE",
      visibility: "PUBLIC",
    });
  }

  const draftService = new DraftProductService();
  let draftProduct: any = null;

  try {
    // 0. Create Draft Product
    console.log("\n--- Creating Draft Product ---");
    draftProduct = await draftService.createDraft({
      sellerId: TEST_SELLER_ID,
      storeId: TEST_SELLER_ID,
      status: "DRAFT",
    });
    console.log(`✅ Draft created with ID: ${draftProduct.id}`);

    const [variant] = await db
      .select()
      .from(productVariantsTable)
      .where(eq(productVariantsTable.productId, draftProduct.id))
      .limit(1);
    const variantId = variant.id;

    // TEST 1: Pricing Promotional Dates & created_by / updated_by
    console.log("\n--- TEST 1: Pricing Promotional Dates & Audit Fields ---");
    const promoStart = "2026-11-01";
    const promoEnd = "2026-11-30";
    await draftService.updatePricing(
      draftProduct.id,
      {
        retailPrice: "1999",
        discountOfferRate: "20",
        effectiveFrom: promoStart,
        effectiveUntil: promoEnd,
        compareAtPrice: "2499",
      },
      TEST_SELLER_ID
    );

    // Verify DB records directly in pricingTable
    const pricingRows = await db
      .select()
      .from(pricingTable)
      .where(eq(pricingTable.variantId, variantId));

    if (pricingRows.length === 0) {
      throw new Error("Pricing record was not created!");
    }
    const pricingRow = pricingRows[0];
    if (pricingRow.createdBy !== TEST_SELLER_ID || pricingRow.updatedBy !== TEST_SELLER_ID) {
      throw new Error(`Pricing audit fields mismatch! createdBy: ${pricingRow.createdBy}, updatedBy: ${pricingRow.updatedBy}`);
    }
    console.log(`✅ Pricing audit fields verified: created_by=${pricingRow.createdBy}, updated_by=${pricingRow.updatedBy}`);

    // Verify getProductById returns YYYY-MM-DD strings so HTML date input works
    const sellerContext = { id: TEST_SELLER_ID, role: "seller", name: "BugFix Seller", email: "bugfix-seller@test.com" } as any;
    let fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.effectiveFrom !== promoStart) {
      throw new Error(`effectiveFrom mismatch! Expected ${promoStart}, got ${fetched.effectiveFrom}`);
    }
    if (fetched.effectiveUntil !== promoEnd) {
      throw new Error(`effectiveUntil mismatch! Expected ${promoEnd}, got ${fetched.effectiveUntil}`);
    }
    console.log(`✅ Pricing promotional dates verified in getProductById: effectiveFrom="${fetched.effectiveFrom}", effectiveUntil="${fetched.effectiveUntil}"`);

    // TEST 2: Variant Fit Type & Foreign Key Constraints in variant_attributes and product_attribute_values
    console.log("\n--- TEST 2: Variant Fit Type & Relational Foreign Keys ---");
    await draftService.updateVariants(
      draftProduct.id,
      {
        sizesMatrix: "M, L, XL",
        colorsTrack: "Navy Blue, Emerald Green",
        fitType: "Slim Fit",
        sleevesStyle: "Full Sleeve",
        fabricMaterial: "Pure Cotton",
        occasion: "Festive Wear",
        gender: "Men",
      },
      TEST_SELLER_ID
    );

    // Verify productAttributeValuesTable has valid foreign keys (attributeId, attributeOptionId)
    const attrValues = await db
      .select()
      .from(productAttributeValuesTable)
      .where(eq(productAttributeValuesTable.productId, draftProduct.id));

    if (attrValues.length === 0) {
      throw new Error("productAttributeValuesTable has 0 records!");
    }

    for (const av of attrValues) {
      if (!av.attributeId || !av.attributeOptionId) {
        throw new Error(`Found attribute value with missing FK! attributeId: ${av.attributeId}, attributeOptionId: ${av.attributeOptionId}`);
      }
      if (av.createdBy !== TEST_SELLER_ID || av.updatedBy !== TEST_SELLER_ID) {
        throw new Error(`Attribute value audit fields mismatch! createdBy: ${av.createdBy}, updatedBy: ${av.updatedBy}`);
      }
    }
    console.log(`✅ Verified ${attrValues.length} product_attribute_values records with proper FKs and audit fields.`);

    // Verify productVariantOptionsTable (variant_attributes)
    const variantOptions = await db
      .select()
      .from(productVariantOptionsTable)
      .where(eq(productVariantOptionsTable.variantId, variantId));

    if (variantOptions.length === 0) {
      throw new Error("productVariantOptionsTable has 0 records!");
    }

    for (const vo of variantOptions) {
      if (!vo.attributeId || !vo.attributeOptionId) {
        throw new Error(`Found variant option with missing FK! attributeId: ${vo.attributeId}, attributeOptionId: ${vo.attributeOptionId}`);
      }
      if (vo.createdBy !== TEST_SELLER_ID || vo.updatedBy !== TEST_SELLER_ID) {
        throw new Error(`Variant option audit fields mismatch! createdBy: ${vo.createdBy}, updatedBy: ${vo.updatedBy}`);
      }
    }
    console.log(`✅ Verified ${variantOptions.length} variant_attributes records with proper FKs and audit fields.`);

    // Verify getProductById retrieves fitType accurately
    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.fitType !== "Slim Fit") {
      throw new Error(`fitType mismatch! Expected 'Slim Fit', got '${fetched.fitType}'`);
    }
    console.log(`✅ Variant fitType verified in getProductById: "${fetched.fitType}"`);

    // TEST 3: Delivery Section & Shipping Audit Fields
    console.log("\n--- TEST 3: Delivery Hub / Address & Logistics Persistence ---");
    const manualAddress = "Shop 102, Fashion Street, Fort, Mumbai - 400001";
    await draftService.updateDelivery(
      draftProduct.id,
      {
        pickupHubId: "hub-main-pimpri",
        pickupHubAddress: manualAddress,
        deliveryZone: "REGIONAL",
        packageWeight: "0.85",
        deliveryRadiusRange: "Within 25 km",
        estimatedDeliveryWindow: "2 - 3 Days",
        shippingPartnerId: "bluedart",
      },
      TEST_SELLER_ID
    );

    // Verify shippingTable record
    const shippingRows = await db
      .select()
      .from(shippingTable)
      .where(eq(shippingTable.variantId, variantId));

    if (shippingRows.length === 0) {
      throw new Error("shippingTable has 0 records!");
    }
    const shippingRow = shippingRows[0];
    if (shippingRow.createdBy !== TEST_SELLER_ID || shippingRow.updatedBy !== TEST_SELLER_ID) {
      throw new Error(`Shipping audit fields mismatch! createdBy: ${shippingRow.createdBy}, updatedBy: ${shippingRow.updatedBy}`);
    }
    if ((shippingRow.metadata as any)?.pickupHubAddress !== manualAddress) {
      throw new Error(`Manual address not saved in shipping metadata! Got: ${(shippingRow.metadata as any)?.pickupHubAddress}`);
    }
    console.log(`✅ Shipping record verified: created_by=${shippingRow.createdBy}, updated_by=${shippingRow.updatedBy}, weight=${shippingRow.weight}`);

    // Verify getProductById retrieves delivery fields accurately
    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (fetched.pickupHubAddress !== manualAddress) {
      throw new Error(`pickupHubAddress mismatch! Expected '${manualAddress}', got '${fetched.pickupHubAddress}'`);
    }
    if (fetched.deliveryZone !== "REGIONAL") {
      throw new Error(`deliveryZone mismatch! Expected 'REGIONAL', got '${fetched.deliveryZone}'`);
    }
    if (fetched.packageWeight !== "0.85") {
      throw new Error(`packageWeight mismatch! Expected '0.85', got '${fetched.packageWeight}'`);
    }
    if (fetched.deliveryRadiusRange !== "Within 25 km") {
      throw new Error(`deliveryRadiusRange mismatch! Expected 'Within 25 km', got '${fetched.deliveryRadiusRange}'`);
    }
    if (fetched.estimatedDeliveryWindow !== "2 - 3 Days") {
      throw new Error(`estimatedDeliveryWindow mismatch! Expected '2 - 3 Days', got '${fetched.estimatedDeliveryWindow}'`);
    }
    if (fetched.shippingPartnerId !== "bluedart") {
      throw new Error(`shippingPartnerId mismatch! Expected 'bluedart', got '${fetched.shippingPartnerId}'`);
    }
    console.log("✅ Delivery fields verified in getProductById.");

    // TEST 4: SEO Section & Tags / Tag Mappings
    console.log("\n--- TEST 4: SEO Keywords & Product Tag Mappings ---");
    const keywords = "designer kurti, ethnic festive, summer fashion";
    await draftService.updateSeo(
      draftProduct.id,
      {
        searchKeywords: keywords,
        customVisibility: "PUBLIC",
      },
      TEST_SELLER_ID
    );

    // Verify productSeoTable
    const seoRows = await db
      .select()
      .from(productSeoTable)
      .where(eq(productSeoTable.productId, draftProduct.id));

    if (seoRows.length === 0) {
      throw new Error("productSeoTable has 0 records!");
    }
    const seoRow = seoRows[0];
    if (seoRow.createdBy !== TEST_SELLER_ID || seoRow.updatedBy !== TEST_SELLER_ID) {
      throw new Error(`Product SEO audit fields mismatch! createdBy: ${seoRow.createdBy}, updatedBy: ${seoRow.updatedBy}`);
    }
    console.log(`✅ SEO record verified: created_by=${seoRow.createdBy}, updated_by=${seoRow.updatedBy}, metaKeywords=${JSON.stringify(seoRow.metaKeywords)}`);

    // Verify productTagsTable and productTagMappingsTable
    const mappings = await db
      .select()
      .from(productTagMappingsTable)
      .where(eq(productTagMappingsTable.productId, draftProduct.id));

    if (mappings.length === 0) {
      throw new Error("productTagMappingsTable has 0 records!");
    }
    for (const m of mappings) {
      if (m.createdBy !== TEST_SELLER_ID) {
        throw new Error(`Tag mapping createdBy mismatch! createdBy: ${m.createdBy}`);
      }
    }
    console.log(`✅ Verified ${mappings.length} product_tag_mappings records with created_by.`);

    // Verify getProductById returns searchKeywords
    fetched = await getProductById(draftProduct.id, sellerContext);
    if (fetched instanceof Error) throw fetched;

    if (!fetched.searchKeywords || !fetched.searchKeywords.includes("designer kurti")) {
      throw new Error(`searchKeywords mismatch in getProductById! Got: '${fetched.searchKeywords}'`);
    }
    console.log(`✅ SEO searchKeywords verified in getProductById: "${fetched.searchKeywords}"`);

    console.log("\n🎉 ALL 4 BUG FIXES & AUDIT LOGGING VALIDATION TESTS PASSED SUCCESSFULLY! ✅");
  } finally {
    if (draftProduct?.id) {
      console.log("\n🧹 Cleaning up test product...");
      await db.delete(productVariantsTable).where(eq(productVariantsTable.productId, draftProduct.id));
      await db.delete(productsTable).where(eq(productsTable.id, draftProduct.id));
      console.log("✅ Cleaned up successfully.");
    }
  }

  process.exit(0);
}

runBugFixValidationTests().catch((err) => {
  console.error("❌ Validation test error:", err);
  process.exit(1);
});
