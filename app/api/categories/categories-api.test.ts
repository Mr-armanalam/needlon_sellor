import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runCategoryApiTests() {
  const { GET, POST } = await import("./route");
  const { PATCH, DELETE } = await import("./[id]/route");
  const { db } = await import("@/db");
  const { categories } = await import("@/db/schema/catalog/category/table");
  const { eq } = await import("drizzle-orm");

  console.log("🌐 Starting Category API Route Integration Tests...");

  const timestamp = Date.now();
  let createdCategoryId: string | null = null;

  try {
    // 1. Test POST /api/categories
    console.log("\n1. Testing POST /api/categories...");
    const postReq = new Request("http://localhost:3000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `API Test Ethnic Wear ${timestamp}`,
        description: "Category generated via API integration test",
      }),
    });

    const postRes = await POST(postReq as any);
    const postJson = await postRes.json();

    if (!postRes.ok || !postJson.data?.id) {
      console.error("❌ POST /api/categories failed:", postJson);
      process.exit(1);
    }

    createdCategoryId = postJson.data.id;
    console.log(`✅ POST /api/categories succeeded! Category ID: ${createdCategoryId}`);

    // 2. Test GET /api/categories
    console.log("\n2. Testing GET /api/categories...");
    const getReq = new Request("http://localhost:3000/api/categories", { method: "GET" });
    const getRes = await GET();
    const getJson = await getRes.json();

    if (!getRes.ok || !getJson.data?.tree) {
      console.error("❌ GET /api/categories failed:", getJson);
      process.exit(1);
    }
    console.log(`✅ GET /api/categories returned tree hierarchy successfully`);

    // 3. Test PATCH /api/categories/[id]
    console.log("\n3. Testing PATCH /api/categories/[id]...");
    const patchReq = new Request(`http://localhost:3000/api/categories/${createdCategoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Updated API Test Category ${timestamp}`,
      }),
    });

    const patchRes = await PATCH(patchReq as any, { params: Promise.resolve({ id: createdCategoryId }) });
    const patchJson = await patchRes.json();

    if (!patchRes.ok || !patchJson.data?.name.startsWith("Updated")) {
      console.error("❌ PATCH /api/categories/[id] failed:", patchJson);
      process.exit(1);
    }
    console.log(`✅ PATCH /api/categories/[id] updated category name successfully`);

    // 4. Test DELETE /api/categories/[id]
    console.log("\n4. Testing DELETE /api/categories/[id]...");
    const deleteReq = new Request(`http://localhost:3000/api/categories/${createdCategoryId}`, {
      method: "DELETE",
    });

    const deleteRes = await DELETE(deleteReq as any, { params: Promise.resolve({ id: createdCategoryId }) });
    const deleteJson = await deleteRes.json();

    if (!deleteRes.ok) {
      console.error("❌ DELETE /api/categories/[id] failed:", deleteJson);
      process.exit(1);
    }
    console.log(`✅ DELETE /api/categories/[id] soft-deleted category successfully`);

    console.log("\n🎉 ALL CATEGORY API ROUTE INTEGRATION TESTS PASSED! ✅");
  } finally {
    if (createdCategoryId) {
      console.log("\n🧹 Cleaning up test category record from DB...");
      await db.delete(categories).where(eq(categories.id, createdCategoryId));
      console.log("✅ Cleanup completed.");
    }
  }

  process.exit(0);
}

runCategoryApiTests().catch((err) => {
  console.error("❌ Category API test execution error:", err);
  process.exit(1);
});
