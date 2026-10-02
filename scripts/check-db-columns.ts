import "dotenv/config";
import postgres from "postgres";

async function checkColumns() {
  const sql = postgres(process.env.DATABASE_URL!);
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'product_variants';
  `;
  console.log("product_variants columns:", columns);
  await sql.end();
}

checkColumns();
