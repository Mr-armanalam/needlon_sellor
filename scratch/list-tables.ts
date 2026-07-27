import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
  const result = await db.execute(
    sql`SELECT 
      COALESCE(NULLIF(regexp_replace('₹1,200', '[^0-9.]', '', 'g'), '')::numeric, 0) as test1,
      COALESCE(NULLIF(regexp_replace('', '[^0-9.]', '', 'g'), '')::numeric, 0) as test2,
      COALESCE(NULLIF(regexp_replace('   ', '[^0-9.]', '', 'g'), '')::numeric, 0) as test3,
      COALESCE(NULLIF(regexp_replace(NULL, '[^0-9.]', '', 'g'), '')::numeric, 0) as test4
    `
  );
  console.log("SQL test results:", result);
}

main().catch(console.error).finally(() => process.exit(0));
