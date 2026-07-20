import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runProductsApiTests() {
  const { GET, POST } = await import("./route");
  const { PATCH, DELETE } = await import("./[id]/route");
  const { db } = await import("@/db");
  const { products } = await import("@/db/schema/products/products");
  const { productVariants } = await import("@/db/schema/products/product_variants");
  const { inventory } = await import("@/db/schema/products/inventry");
  const { eq } = await import("drizzle-orm");

  console.log("🌐 Starting Products API Route Integration Tests...");

  const timestamp = Date.now();
  const testSku = `SKU-API-${timestamp}`;

  const wizardPayload = {
    name: `API Test Chikankari Kurti ${timestamp}`,
    brandLabel: "House of Needlon",
    category: "Ethnic Wear",
    subcategory: "Kurtis",
    descriptionStory: "Handcrafted pure cotton kurti with delicate chikankari embroidery.",
    retailPrice: "2450",
    discountOfferRate: "10",
    sizesMatrix: "S, M, L, XL, XXL",
    colorsTrack: "Ivory White, Indigo Blue",
    fabricMaterial: "100% Chanderi Cotton",
    sleevesStyle: "Three-Quarter Sleeve",
    fitType: "Straight Regular Fit",
    occasionFocus: "Festival, Office Wear",
    genderProfile: "Women",
    targetAgeGroup: "Adults (18-45 Years)",
    boutiqueStockCount: 14,
    uniqueSku: testSku,
    pickupHubAddress: "Studio Workshop, Block 4C, Kalyan, Maharashtra",
    packageWeight: "0.35",
    deliveryRadiusRange: "Nationwide Shipping",
    estimatedDeliveryWindow: "3 - 5 business days delivery timeline",
    searchKeywords: "handloom, chikankari, festive kurti, cotton apparel",
    customVisibility: "PUBLIC" as const,
    status: "PUBLISHED" as const,
  };

  let createdProductId: string | null = null;

  try {
    // 1. Test POST /api/products (Wizard Submission)
    console.log("\n1. Testing POST /api/products (Wizard Submit)...");
    const postReq = new Request("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wizardPayload),
    });

    const postRes = await POST(postReq as any);
    const postJson = await postRes.json();

    if (!postRes.ok || !postJson.data?.id) {
      console.error("❌ POST /api/products failed:", postJson);
      process.exit(1);
    }

    createdProductId = postJson.data.id;
    console.log(`✅ POST /api/products succeeded! Product ID: ${createdProductId}`);
    console.log(`   Slug generated: ${postJson.data.slug}`);

    // 2. Test GET /api/products (Product Listing)
    console.log("\n2. Testing GET /api/products...");
    const getReq = new Request("http://localhost:3000/api/products?page=1&limit=10", {
      method: "GET",
    });

    const getRes = await GET(getReq as any);
    const getJson = await getRes.json();

    if (!getRes.ok || !getJson.data?.items) {
      console.error("❌ GET /api/products failed:", getJson);
      process.exit(1);
    }

    console.log(`✅ GET /api/products returned ${getJson.data.items.length} item(s)`);

    // 3. Test PATCH /api/products/[id] (Status Update)
    console.log("\n3. Testing PATCH /api/products/[id]...");
    const patchReq = new Request(`http://localhost:3000/api/products/${createdProductId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DRAFT" }),
    });

    const patchRes = await PATCH(patchReq as any, { params: Promise.resolve({ id: createdProductId }) });
    const patchJson = await patchRes.json();

    if (!patchRes.ok || patchJson.data?.status !== "DRAFT") {
      console.error("❌ PATCH /api/products/[id] failed:", patchJson);
      process.exit(1);
    }
    console.log(`✅ PATCH /api/products/[id] updated status to "DRAFT"`);

    // 4. Test DELETE /api/products/[id] (Soft Delete)
    console.log("\n4. Testing DELETE /api/products/[id]...");
    const deleteReq = new Request(`http://localhost:3000/api/products/${createdProductId}`, {
      method: "DELETE",
    });

    const deleteRes = await DELETE(deleteReq as any, { params: Promise.resolve({ id: createdProductId }) });
    const deleteJson = await deleteRes.json();

    if (!deleteRes.ok) {
      console.error("❌ DELETE /api/products/[id] failed:", deleteJson);
      process.exit(1);
    }
    console.log(`✅ DELETE /api/products/[id] soft-deleted product`);

    console.log("\n🎉 ALL PRODUCTS API ROUTE INTEGRATION TESTS PASSED! ✅");
  } finally {
    // DB Cleanup
    if (createdProductId) {
      console.log("\n🧹 Cleaning up test records from DB...");
      await db.delete(productVariants).where(eq(productVariants.productId, createdProductId));
      await db.delete(products).where(eq(products.id, createdProductId));
      console.log("✅ Cleanup completed.");
    }
  }

  process.exit(0);
}

runProductsApiTests().catch((err) => {
  console.error("❌ API test execution error:", err);
  process.exit(1);
});
