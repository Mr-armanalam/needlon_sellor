import "dotenv/config";
import postgres from "postgres";

async function initBespokeTables() {
  console.log("--> Initializing bespoke tailoring tables & product schema...");
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    // 1. Add is_customizable column to products table if missing
    await sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN NOT NULL DEFAULT true;
    `;
    console.log("✓ Verified products.is_customizable column.");

    // 2. Create customer_measurements table
    await sql`
      CREATE TABLE IF NOT EXISTS customer_measurements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        seller_id UUID,
        order_id UUID,
        order_item_id UUID,
        product_id UUID,
        customer_name VARCHAR(150),
        customer_phone VARCHAR(25),
        customer_email VARCHAR(150),
        gender VARCHAR(20) NOT NULL,
        garment_type VARCHAR(50) NOT NULL,
        measurement_unit VARCHAR(10) NOT NULL DEFAULT 'INCHES',
        essential_measurements JSONB NOT NULL DEFAULT '{}'::jsonb,
        posture_specifics JSONB NOT NULL DEFAULT '{}'::jsonb,
        fit_preference VARCHAR(30) DEFAULT 'REGULAR',
        tailor_notes TEXT,
        source VARCHAR(30) NOT NULL DEFAULT 'ONLINE_CUSTOMER',
        status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("✓ Verified customer_measurements table.");

    // 3. Create helpful indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_customer_measurements_user 
      ON customer_measurements(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_customer_measurements_seller 
      ON customer_measurements(seller_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_customer_measurements_order 
      ON customer_measurements(order_id);
    `;
    console.log("✓ Verified customer_measurements indexes.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await sql.end();
    console.log("=== Bespoke tables setup complete! ===");
  }
}

initBespokeTables().catch(console.error);
