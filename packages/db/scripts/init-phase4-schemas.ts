import "dotenv/config";
import postgres from "postgres";

async function initPhase4Schemas() {
  console.log("--> Initializing Phase 4: Bespoke Atelier Fitting Appointments Table...");
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS fitting_appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES product_orders(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scheduled_at TIMESTAMPTZ NOT NULL,
        duration_minutes INT NOT NULL DEFAULT 30,
        status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
        fitting_notes TEXT,
        alterations_required BOOLEAN NOT NULL DEFAULT false,
        alteration_details TEXT,
        tailor_master_name VARCHAR(150),
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_fitting_appointments_order ON fitting_appointments(order_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_fitting_appointments_seller ON fitting_appointments(seller_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_fitting_appointments_customer ON fitting_appointments(customer_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_fitting_appointments_scheduled ON fitting_appointments(scheduled_at);
    `;
    console.log("✓ Verified fitting_appointments table and relational indexes.");

    console.log("=== PHASE 4 DATABASE SCHEMAS READY ===");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

initPhase4Schemas();
