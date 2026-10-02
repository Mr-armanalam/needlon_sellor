import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { seller } from "@/db/schema/seller";

async function runAuthSchemaTest() {
  console.log("🚀 Running Auth Seller Schema Test...");

  const [testSeller] = await db
    .select({
      id: seller.id,
      email: seller.email,
      name: seller.name,
      role: seller.role,
    })
    .from(seller)
    .limit(1);

  console.log("✅ Seller db.select Succeeded:", testSeller ? testSeller.email : "No sellers found in DB");

  const existingSeller = await db.query.sellers.findFirst({
    where: eq(seller.email, "armanalam78578@gmail.com"),
  });

  console.log("✅ Seller db.query.sellers.findFirst Succeeded:", existingSeller ? existingSeller.email : "Seller not found");
}

runAuthSchemaTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Auth Schema Test Failed:", err);
    process.exit(1);
  });
