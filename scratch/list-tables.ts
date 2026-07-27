import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
  const result = await db.execute(sql`
    UPDATE products 
    SET seller_id = 'e98e4537-b11e-4f04-9c68-06dcfcfdd691' 
    WHERE seller_id = '00000000-0000-0000-0000-000000000000' 
       OR seller_id = '00000000-0000-0000-0000-000000000001'
  `);
  console.log("Reassigned legacy dummy products to registered seller:", result);
}

main().catch(console.error).finally(() => process.exit(0));
