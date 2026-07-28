import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Fixing missing column deleted_at in seller_store...");
  await db.execute(sql`ALTER TABLE seller_store ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;`);
  console.log("✅ Successfully added deleted_at column to seller_store table!");
}

main().catch(console.error).finally(() => process.exit(0));
