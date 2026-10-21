import "dotenv/config";
import postgres from "postgres";

async function syncAllSchemas() {
  console.log("=================================================================");
  console.log("== Starting Comprehensive Supabase Schema Sync (Option A)      ==");
  console.log("=================================================================");

  const sql = postgres(process.env.DATABASE_URL!);

  try {
    // -------------------------------------------------------------
    // 1. Enums & Custom Types
    // -------------------------------------------------------------
    console.log("\n--> [1/7] Verifying required PostgreSQL Enums...");

    await sql`
      DO $$ BEGIN
        CREATE TYPE payout_request_status AS ENUM (
          'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED', 'CANCELLED'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE dimension_unit AS ENUM ('CM', 'MM', 'IN');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE ai_moderation_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED', 'NEEDS_REVIEW');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;

    console.log("  ? Enums verified.");

    // -------------------------------------------------------------
    // 2. Missing Tables: seller_payout_requests
    // -------------------------------------------------------------
    console.log("\n--> [2/7] Verifying Missing Tables (seller_payout_requests)...");

    await sql`
      CREATE TABLE IF NOT EXISTS seller_payout_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES seller(id) ON DELETE RESTRICT,
        bank_account_id UUID REFERENCES seller_bank_accounts(id) ON DELETE SET NULL,
        payout_number VARCHAR(50) NOT NULL UNIQUE,
        amount NUMERIC(18, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'INR',
        status payout_request_status NOT NULL DEFAULT 'PENDING',
        fee NUMERIC(18, 2) NOT NULL DEFAULT 0,
        net_amount NUMERIC(18, 2) NOT NULL,
        processed_at TIMESTAMPTZ,
        rejection_reason TEXT,
        transaction_id VARCHAR(100),
        payout_method VARCHAR(50) NOT NULL DEFAULT 'BANK_TRANSFER',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // The Drizzle schema declares deleted_at (soft delete) on this table,
    // but the CREATE TABLE above never included it — dashboard payout
    // aggregates filter on it and failed with "column does not exist".
    await sql`
      ALTER TABLE seller_payout_requests
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_seller_payout_requests_seller ON seller_payout_requests(seller_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_seller_payout_requests_status ON seller_payout_requests(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_seller_payout_requests_created ON seller_payout_requests(created_at);`;
    console.log("  ? Table seller_payout_requests and indexes verified.");

    // -------------------------------------------------------------
    // 3. Clean up orphaned test data before attaching Foreign Keys
    // -------------------------------------------------------------
    console.log("\n--> [3/7] Cleaning orphaned records from unconstrained tables...");

    await sql`DELETE FROM pricing WHERE variant_id NOT IN (SELECT id FROM product_variants);`;
    await sql`UPDATE pricing SET created_by = NULL WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM seller);`;
    await sql`UPDATE pricing SET updated_by = NULL WHERE updated_by IS NOT NULL AND updated_by NOT IN (SELECT id FROM seller);`;

    await sql`DELETE FROM shipping WHERE variant_id NOT IN (SELECT id FROM product_variants);`;
    await sql`UPDATE shipping SET created_by = NULL WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM seller);`;
    await sql`UPDATE shipping SET updated_by = NULL WHERE updated_by IS NOT NULL AND updated_by NOT IN (SELECT id FROM seller);`;

    await sql`DELETE FROM product_seo WHERE product_id NOT IN (SELECT id FROM products);`;
    await sql`UPDATE product_seo SET created_by = NULL WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM seller);`;
    await sql`UPDATE product_seo SET updated_by = NULL WHERE updated_by IS NOT NULL AND updated_by NOT IN (SELECT id FROM seller);`;

    await sql`DELETE FROM product_ai WHERE product_id NOT IN (SELECT id FROM products);`;
    await sql`UPDATE product_ai SET created_by = NULL WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM seller);`;
    await sql`UPDATE product_ai SET updated_by = NULL WHERE updated_by IS NOT NULL AND updated_by NOT IN (SELECT id FROM seller);`;

    console.log("  ? Orphaned rows pruned.");

    // -------------------------------------------------------------
    // 4. Pricing Table Constraints and Indexes
    // -------------------------------------------------------------
    console.log("\n--> [4/7] Synchronizing 'pricing' table constraints and indexes...");

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'pricing_variant_id_product_variants_id_fk'
        ) THEN
          ALTER TABLE pricing
          ADD CONSTRAINT pricing_variant_id_product_variants_id_fk
          FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'pricing_created_by_seller_id_fk'
        ) THEN
          ALTER TABLE pricing
          ADD CONSTRAINT pricing_created_by_seller_id_fk
          FOREIGN KEY (created_by) REFERENCES seller(id) ON DELETE SET NULL;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'pricing_updated_by_seller_id_fk'
        ) THEN
          ALTER TABLE pricing
          ADD CONSTRAINT pricing_updated_by_seller_id_fk
          FOREIGN KEY (updated_by) REFERENCES seller(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `;

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS pricing_variant_uidx ON pricing(variant_id);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_variant_idx ON pricing(variant_id);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_currency_code_idx ON pricing(currency_code);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_price_idx ON pricing(price);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_effective_from_idx ON pricing(effective_from);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_effective_until_idx ON pricing(effective_until);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_created_by_idx ON pricing(created_by);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_updated_by_idx ON pricing(updated_by);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_created_at_idx ON pricing(created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_deleted_at_idx ON pricing(deleted_at);`;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pricing_price_check') THEN
          ALTER TABLE pricing ADD CONSTRAINT pricing_price_check CHECK (price >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pricing_compare_at_price_check') THEN
          ALTER TABLE pricing ADD CONSTRAINT pricing_compare_at_price_check CHECK (compare_at_price IS NULL OR compare_at_price >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pricing_cost_price_check') THEN
          ALTER TABLE pricing ADD CONSTRAINT pricing_cost_price_check CHECK (cost_price IS NULL OR cost_price >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pricing_minimum_advertised_price_check') THEN
          ALTER TABLE pricing ADD CONSTRAINT pricing_minimum_advertised_price_check CHECK (minimum_advertised_price IS NULL OR minimum_advertised_price >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pricing_effective_period_check') THEN
          ALTER TABLE pricing ADD CONSTRAINT pricing_effective_period_check CHECK (effective_until IS NULL OR effective_from IS NULL OR effective_until >= effective_from);
        END IF;
      END $$;
    `;

    console.log("  ? 'pricing' table FKs, indexes, and constraints verified.");

    // -------------------------------------------------------------
    // 5. Shipping Table Constraints and Indexes
    // -------------------------------------------------------------
    console.log("\n--> [5/7] Synchronizing 'shipping' table constraints and indexes...");

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'shipping_variant_id_product_variants_id_fk'
        ) THEN
          ALTER TABLE shipping
          ADD CONSTRAINT shipping_variant_id_product_variants_id_fk
          FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'shipping_created_by_seller_id_fk'
        ) THEN
          ALTER TABLE shipping
          ADD CONSTRAINT shipping_created_by_seller_id_fk
          FOREIGN KEY (created_by) REFERENCES seller(id) ON DELETE SET NULL;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'shipping_updated_by_seller_id_fk'
        ) THEN
          ALTER TABLE shipping
          ADD CONSTRAINT shipping_updated_by_seller_id_fk
          FOREIGN KEY (updated_by) REFERENCES seller(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `;

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS shipping_variant_uidx ON shipping(variant_id);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_variant_idx ON shipping(variant_id);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_requires_shipping_idx ON shipping(requires_shipping);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_is_free_shipping_idx ON shipping(is_free_shipping);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_shipping_class_idx ON shipping(shipping_class);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_is_fragile_idx ON shipping(is_fragile);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_is_hazardous_idx ON shipping(is_hazardous);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_created_by_idx ON shipping(created_by);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_updated_by_idx ON shipping(updated_by);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_created_at_idx ON shipping(created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS shipping_deleted_at_idx ON shipping(deleted_at);`;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shipping_weight_check') THEN
          ALTER TABLE shipping ADD CONSTRAINT shipping_weight_check CHECK (weight IS NULL OR weight >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shipping_length_check') THEN
          ALTER TABLE shipping ADD CONSTRAINT shipping_length_check CHECK (length IS NULL OR length >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shipping_width_check') THEN
          ALTER TABLE shipping ADD CONSTRAINT shipping_width_check CHECK (width IS NULL OR width >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shipping_height_check') THEN
          ALTER TABLE shipping ADD CONSTRAINT shipping_height_check CHECK (height IS NULL OR height >= 0);
        END IF;
      END $$;
    `;

    console.log("  ? 'shipping' table FKs, indexes, and constraints verified.");

    // -------------------------------------------------------------
    // 6. Product AI & SEO Constraints
    // -------------------------------------------------------------
    console.log("\n--> [6/7] Synchronizing product_ai and product_seo constraints...");

    // Product AI
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'product_ai_product_id_products_id_fk'
        ) THEN
          ALTER TABLE product_ai
          ADD CONSTRAINT product_ai_product_id_products_id_fk
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS product_ai_product_uidx ON product_ai(product_id);`;
    await sql`CREATE INDEX IF NOT EXISTS product_ai_product_idx ON product_ai(product_id);`;
    await sql`CREATE INDEX IF NOT EXISTS product_ai_moderation_status_idx ON product_ai(moderation_status);`;

    // Product SEO
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'product_seo_product_id_products_id_fk'
        ) THEN
          ALTER TABLE product_seo
          ADD CONSTRAINT product_seo_product_id_products_id_fk
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS product_seo_product_uidx ON product_seo(product_id);`;
    await sql`CREATE INDEX IF NOT EXISTS product_seo_product_idx ON product_seo(product_id);`;

    console.log("  ? 'product_ai' and 'product_seo' constraints verified.");

    // -------------------------------------------------------------
    // 7. Data Backfill (Pricing, Inventory, Shipping for Variants)
    // -------------------------------------------------------------
    console.log("\n--> [7/7] Backfilling missing child records for existing product variants...");

    const pricingBackfill = await sql`
      INSERT INTO pricing (variant_id, price, compare_at_price, cost_price, currency_code, is_tax_inclusive)
      SELECT 
        pv.id,
        COALESCE(NULLIF(regexp_replace(pv.price, '[^0-9.]', '', 'g'), '')::numeric, 0),
        NULLIF(regexp_replace(pv.compare_at_price, '[^0-9.]', '', 'g'), '')::numeric,
        NULLIF(regexp_replace(pv.cost_price, '[^0-9.]', '', 'g'), '')::numeric,
        'INR',
        true
      FROM product_variants pv
      WHERE NOT EXISTS (
        SELECT 1 FROM pricing p WHERE p.variant_id = pv.id
      )
      ON CONFLICT (variant_id) DO NOTHING;
    `;
    console.log(`  ? Backfilled pricing rows: ${pricingBackfill.count || 0}`);

    const inventoryBackfill = await sql`
      INSERT INTO inventory (variant_id, quantity, reserved_quantity, low_stock_threshold, allow_backorder)
      SELECT 
        pv.id,
        10,
        0,
        0,
        false
      FROM product_variants pv
      WHERE NOT EXISTS (
        SELECT 1 FROM inventory inv WHERE inv.variant_id = pv.id
      )
      ON CONFLICT (variant_id) DO NOTHING;
    `;
    console.log(`  ? Backfilled inventory rows: ${inventoryBackfill.count || 0}`);

    const shippingBackfill = await sql`
      INSERT INTO shipping (variant_id, requires_shipping, is_free_shipping, shipping_class)
      SELECT 
        pv.id,
        true,
        false,
        'STANDARD'
      FROM product_variants pv
      WHERE NOT EXISTS (
        SELECT 1 FROM shipping sh WHERE sh.variant_id = pv.id
      )
      ON CONFLICT (variant_id) DO NOTHING;
    `;
    console.log(`  ? Backfilled shipping rows: ${shippingBackfill.count || 0}`);

    // -------------------------------------------------------------
    // 8. Product Listing Redesign: subcategory_id, brand_id, brand_name, discount_rate, estimated_delivery_window
    // -------------------------------------------------------------
    console.log("\n--> [8/8] Synchronizing Product Listing fields (subcategory_id, brand_id, discount_rate)...");

    await sql`
      CREATE TABLE IF NOT EXISTS brands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(180) NOT NULL,
        description TEXT,
        logo_url TEXT,
        website_url TEXT,
        is_verified BOOLEAN DEFAULT false NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS brands_slug_idx ON brands(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS brands_seller_idx ON brands(seller_id);`;

    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_name VARCHAR(100);`;
    await sql`CREATE INDEX IF NOT EXISTS products_subcategory_idx ON products(subcategory_id);`;
    await sql`CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand_id);`;

    await sql`ALTER TABLE pricing ADD COLUMN IF NOT EXISTS discount_rate NUMERIC(5, 2) DEFAULT '0.00';`;
    await sql`CREATE INDEX IF NOT EXISTS pricing_discount_rate_idx ON pricing(discount_rate);`;

    await sql`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS estimated_delivery_window VARCHAR(100);`;

    console.log("  ? Product Listing fields and indexes verified.");

    // -------------------------------------------------------------
    // 8. Delivery platform tables (executives, assignments, per-seller
    //    delivery settings/zones, carrier connections) + partner/shipment
    //    extensions. Mirrors packages/db/db/schema/delivery/*.
    // -------------------------------------------------------------
    console.log("\n--> [8/8] Verifying delivery platform tables...");

    await sql`
      DO $$ BEGIN
        CREATE TYPE partner_integration_type AS ENUM ('AGGREGATOR_API', 'DIRECT_API', 'MANUAL', 'INHOUSE');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;
    await sql`
      DO $$ BEGIN
        CREATE TYPE delivery_executive_status AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'INACTIVE');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;
    await sql`
      DO $$ BEGIN
        CREATE TYPE delivery_assignment_status AS ENUM ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'FAILED', 'REASSIGNED', 'CANCELLED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;
    await sql`
      DO $$ BEGIN
        CREATE TYPE carrier_environment AS ENUM ('SANDBOX', 'LIVE');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS delivery_executives (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL UNIQUE,
        email VARCHAR(255),
        password_hash VARCHAR(255),
        vehicle_type VARCHAR(50),
        vehicle_number VARCHAR(30),
        license_number VARCHAR(50),
        address_line TEXT,
        city VARCHAR(150),
        state VARCHAR(150),
        pincode VARCHAR(20),
        status delivery_executive_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
        is_available BOOLEAN NOT NULL DEFAULT true,
        created_by UUID REFERENCES seller(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS delivery_assignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shipment_id UUID NOT NULL REFERENCES shipment_orders(id) ON DELETE CASCADE,
        order_id UUID NOT NULL REFERENCES product_orders(id) ON DELETE CASCADE,
        executive_id UUID NOT NULL REFERENCES delivery_executives(id) ON DELETE RESTRICT,
        assigned_by UUID NOT NULL REFERENCES seller(id) ON DELETE RESTRICT,
        status delivery_assignment_status NOT NULL DEFAULT 'ASSIGNED',
        assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        accepted_at TIMESTAMPTZ,
        picked_up_at TIMESTAMPTZ,
        delivered_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        failure_reason TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;`;
    await sql`CREATE INDEX IF NOT EXISTS delivery_assignments_shipment_idx ON delivery_assignments(shipment_id);`;
    await sql`CREATE INDEX IF NOT EXISTS delivery_assignments_executive_idx ON delivery_assignments(executive_id);`;

    await sql`
      CREATE TABLE IF NOT EXISTS seller_delivery_settings (
        seller_id UUID PRIMARY KEY REFERENCES seller(id) ON DELETE CASCADE,
        max_radius_km NUMERIC(6, 2) NOT NULL DEFAULT 15,
        base_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
        free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 0,
        hub_name VARCHAR(200),
        hub_address VARCHAR(500),
        hub_city VARCHAR(150),
        hub_pincode VARCHAR(20),
        hub_phone VARCHAR(30),
        operating_hours VARCHAR(200),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS seller_shipping_zones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        zone_name VARCHAR(150) NOT NULL,
        partner_code VARCHAR(50),
        flat_rate_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
        estimated_days VARCHAR(50),
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS seller_shipping_zones_seller_idx ON seller_shipping_zones(seller_id);`;

    await sql`
      CREATE TABLE IF NOT EXISTS seller_carrier_connections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        partner_id UUID NOT NULL REFERENCES shipping_partners(id) ON DELETE CASCADE,
        environment carrier_environment NOT NULL DEFAULT 'SANDBOX',
        credentials_encrypted TEXT,
        config JSONB,
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_verified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS seller_carrier_connections_seller_partner_unique ON seller_carrier_connections(seller_id, partner_id);`;

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS shipping_partners_partner_code_unique ON shipping_partners(partner_code);`;
    await sql`ALTER TABLE shipping_partners ADD COLUMN IF NOT EXISTS integration_type partner_integration_type NOT NULL DEFAULT 'MANUAL';`;
    await sql`ALTER TABLE shipping_partners ADD COLUMN IF NOT EXISTS api_base_url VARCHAR(500);`;
    await sql`ALTER TABLE shipment_orders ADD COLUMN IF NOT EXISTS executive_id UUID REFERENCES delivery_executives(id) ON DELETE SET NULL;`;
    await sql`ALTER TABLE shipment_orders ADD COLUMN IF NOT EXISTS label_url TEXT;`;
    await sql`ALTER TABLE shipment_orders ADD COLUMN IF NOT EXISTS label_generated_at TIMESTAMPTZ;`;

    console.log("  ? Delivery platform tables verified.");

    // =======================================================================
    // 9. PLATFORM ADMIN FOUNDATION
    // =======================================================================
    console.log("\n--> [9/9] Verifying platform admin tables (platform_settings, seller suspension, method charges)...");

    await sql`
      CREATE TABLE IF NOT EXISTS platform_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_by UUID REFERENCES seller(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // Seed the platform commission rate (5%) exactly once — admin edits
    // made later through the admin surface must never be overwritten.
    await sql`
      INSERT INTO platform_settings (key, value)
      VALUES ('commissionRate', '0.05'::jsonb)
      ON CONFLICT (key) DO NOTHING;
    `;

    // Seller suspension flag (admin-managed; enforced at login).
    await sql`ALTER TABLE seller ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;`;

    // Admin-managed rate card columns on shipping methods.
    await sql`ALTER TABLE shipping_methods ADD COLUMN IF NOT EXISTS base_charge NUMERIC(10, 2) NOT NULL DEFAULT 0;`;
    await sql`ALTER TABLE shipping_methods ADD COLUMN IF NOT EXISTS per_kg_charge NUMERIC(10, 2) NOT NULL DEFAULT 0;`;

    // Knowledge-base publish flag (admin authoring). IF EXISTS: the table
    // itself is created by init-help-feedback-tables.ts.
    await sql`ALTER TABLE IF EXISTS knowledge_base_articles ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;`;

    console.log("  ? Platform admin tables verified.");

    console.log("\n=================================================================");
    console.log("== ALL SUPABASE SCHEMAS SUCCESSFULLY SYNCHRONIZED!             ==");
    console.log("=================================================================");

  } catch (err) {
    console.error("FATAL ERROR during schema synchronization:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

syncAllSchemas().catch(console.error);

