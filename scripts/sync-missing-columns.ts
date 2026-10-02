import "dotenv/config";
import postgres from "postgres";

async function syncColumns() {
  console.log("--> Syncing database schema column additions...");
  const sql = postgres(process.env.DATABASE_URL!);
  
  await sql`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS variant_name varchar(255);`;
  console.log("✓ Added variant_name to product_variants if needed.");
  
  await sql.end();
  console.log("=== Column sync complete! ===");
}

syncColumns().catch(console.error);
