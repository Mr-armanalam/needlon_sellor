import "dotenv/config";
import postgres from "postgres";

async function initPhase1Schemas() {
  console.log("--> Initializing Phase 1: In-Store Atelier & Privacy Chat Tables...");
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    // 1. Create seller_customers table (linking tailor shop with customer user account)
    await sql`
      CREATE TABLE IF NOT EXISTS seller_customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        customer_notes TEXT,
        created_in_store BOOLEAN NOT NULL DEFAULT true,
        total_in_store_orders INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_seller_customers_unique 
      ON seller_customers(seller_id, user_id);
    `;
    console.log("✓ Verified seller_customers table and unique index.");

    // 2. Create chat_permissions table (privacy-protected chat request gate)
    await sql`
      CREATE TABLE IF NOT EXISTS chat_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        request_message TEXT,
        requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        responded_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_permissions_unique 
      ON chat_permissions(seller_id, buyer_id);
    `;
    console.log("✓ Verified chat_permissions table and unique index.");

    // 3. Add tailoringStage & tailoringNotes to product_orders table
    await sql`
      ALTER TABLE product_orders 
      ADD COLUMN IF NOT EXISTS tailoring_stage VARCHAR(50);
    `;
    await sql`
      ALTER TABLE product_orders 
      ADD COLUMN IF NOT EXISTS tailoring_notes TEXT;
    `;
    console.log("✓ Verified product_orders tailoring_stage and tailoring_notes columns.");

    // 4. Safely add 'IN_STORE' value to order_source enum if it exists
    try {
      await sql`
        ALTER TYPE order_source ADD VALUE IF NOT EXISTS 'IN_STORE';
      `;
      console.log("✓ Added 'IN_STORE' to order_source enum.");
    } catch (e: unknown) {
      console.log(
        "Notice on order_source enum:",
        e instanceof Error ? e.message : String(e)
      );
    }
  } catch (err) {
    console.error("Phase 1 Migration error:", err);
    throw err;
  } finally {
    await sql.end();
    console.log("=== Phase 1 Database Migration Complete! ===");
  }
}

initPhase1Schemas().catch(console.error);
