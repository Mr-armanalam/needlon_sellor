import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

let dbUrl = process.env.DATABASE_URL!;
console.log("Original DATABASE_URL:", dbUrl);
if (dbUrl && dbUrl.includes(":6543")) {
  dbUrl = dbUrl.replace(":6543", ":5432");
  console.log("Rewrote to direct DATABASE_URL (port 5432):", dbUrl);
  process.env.DATABASE_URL = dbUrl;
}

import { sql } from "drizzle-orm";

async function run() {
  const { db } = await import("../db/index");
  console.log("Altering column cdn_url to TYPE text in product_media table...");
  await db.execute(sql.raw(`ALTER TABLE product_media ALTER COLUMN cdn_url TYPE text;`));
  console.log("Column altered successfully.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to alter column:", err);
  process.exit(1);
});
