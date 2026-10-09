import "dotenv/config";
import postgres from "postgres";

async function initClientTables() {
  console.log("--> Initializing / Syncing Client-Specific Database Tables...");
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("DATABASE_URL not set in environment, skipping PostgreSQL table creation.");
    return;
  }

  const sql = postgres(dbUrl);

  try {
    // 1. User Addresses
    await sql`
      CREATE TABLE IF NOT EXISTS "user_addresses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "full_name" varchar(255) NOT NULL,
        "phone" varchar(30) NOT NULL,
        "address_line_1" varchar(255) NOT NULL,
        "address_line_2" varchar(255),
        "city" varchar(100) NOT NULL,
        "state" varchar(100) NOT NULL,
        "postal_code" varchar(20) NOT NULL,
        "country" varchar(100) DEFAULT 'India' NOT NULL,
        "address_type" varchar(50) DEFAULT 'HOME' NOT NULL,
        "is_default" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ user_addresses table ready.");

    // 2. Client Carts
    await sql`
      CREATE TABLE IF NOT EXISTS "client_carts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ client_carts table ready.");

    // 3. Client Cart Items
    await sql`
      CREATE TABLE IF NOT EXISTS "client_cart_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "cart_id" uuid NOT NULL REFERENCES "client_carts"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity" integer DEFAULT 1 NOT NULL,
        "size" varchar(50),
        "color" varchar(50),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ client_cart_items table ready.");

    // 4. Client Wishlists
    await sql`
      CREATE TABLE IF NOT EXISTS "client_wishlists" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ client_wishlists table ready.");

    // 5. Client Hero Banners
    await sql`
      CREATE TABLE IF NOT EXISTS "client_hero_banners" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "description" text,
        "image" text NOT NULL,
        "offer" varchar(100),
        "slug" varchar(150),
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ client_hero_banners table ready.");

    // 6. Client Search History
    await sql`
      CREATE TABLE IF NOT EXISTS "client_search_history" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
        "query" varchar(255) NOT NULL,
        "search_count" integer DEFAULT 1 NOT NULL,
        "last_searched_at" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS "client_search_history_user_idx" ON "client_search_history"("user_id");`;
    await sql`CREATE INDEX IF NOT EXISTS "client_search_history_query_idx" ON "client_search_history"("query");`;
    console.log("✓ client_search_history table ready.");

    // 7. Client Recently Viewed
    await sql`
      CREATE TABLE IF NOT EXISTS "client_recently_viewed" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "viewed_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS "client_recently_viewed_user_idx" ON "client_recently_viewed"("user_id");`;
    await sql`CREATE INDEX IF NOT EXISTS "client_recently_viewed_product_idx" ON "client_recently_viewed"("product_id");`;
    console.log("✓ client_recently_viewed table ready.");

    // 8. Client Loyalty Accounts
    await sql`
      CREATE TABLE IF NOT EXISTS "client_loyalty_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
        "points_balance" integer DEFAULT 0 NOT NULL,
        "tier" varchar(50) DEFAULT 'BRONZE' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ client_loyalty_accounts table ready.");

    console.log("=== All Client Tables Verified and Ready! ===");
  } catch (err) {
    console.error("Error creating client tables:", err);
  } finally {
    await sql.end();
  }
}

initClientTables().catch(console.error);
