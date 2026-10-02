import * as dotenv from "dotenv";
dotenv.config();

let dbUrl = process.env.DATABASE_URL!;
console.log("Original DATABASE_URL:", dbUrl);
if (dbUrl && dbUrl.includes(":6543")) {
  dbUrl = dbUrl.replace(":6543", ":5432");
  console.log("Rewrote to direct DATABASE_URL (port 5432):", dbUrl);
  process.env.DATABASE_URL = dbUrl;
}

import { sql } from "drizzle-orm";

async function run() {
  const { db } = await import("./db");
  console.log("Recreating category_attributes and category_attribute_options tables...");
  
  await db.execute(sql.raw(`
    DROP TABLE IF EXISTS "category_attribute_options" CASCADE;
    DROP TABLE IF EXISTS "category_attributes" CASCADE;

    CREATE TABLE "category_attributes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "category_id" uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      "attribute_key" varchar(100) NOT NULL,
      "name" varchar(100) NOT NULL,
      "slug" varchar(120) NOT NULL,
      "description" varchar(255),
      "input_type" "public"."attribute_input_type" NOT NULL,
      "data_type" "public"."attribute_data_type" NOT NULL,
      "is_required" boolean DEFAULT false NOT NULL,
      "is_filterable" boolean DEFAULT false NOT NULL,
      "is_searchable" boolean DEFAULT false NOT NULL,
      "is_comparable" boolean DEFAULT false NOT NULL,
      "is_variant_attribute" boolean DEFAULT false NOT NULL,
      "system_defined" boolean DEFAULT true NOT NULL,
      "status" "public"."catalog_status" DEFAULT 'ACTIVE' NOT NULL,
      "display_order" integer DEFAULT 0 NOT NULL,
      "show_on_listing" boolean DEFAULT false NOT NULL,
      "placeholder" varchar(255),
      "helper_text" varchar(255),
      "unit" varchar(50),
      "attribute_group" varchar(100),
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid REFERENCES seller(id) ON DELETE SET NULL,
      "updated_by" uuid REFERENCES seller(id) ON DELETE SET NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    );

    CREATE UNIQUE INDEX "category_attributes_category_attribute_key_uidx" ON "category_attributes" ("category_id", "attribute_key");
    CREATE UNIQUE INDEX "category_attributes_category_slug_uidx" ON "category_attributes" ("category_id", "slug");
    CREATE INDEX "category_attributes_category_idx" ON "category_attributes" ("category_id");
    CREATE INDEX "category_attributes_category_display_order_idx" ON "category_attributes" ("category_id", "display_order");
    CREATE INDEX "category_attributes_category_filterable_idx" ON "category_attributes" ("category_id", "is_filterable");
    CREATE INDEX "category_attributes_category_searchable_idx" ON "category_attributes" ("category_id", "is_searchable");
    CREATE INDEX "category_attributes_category_variant_idx" ON "category_attributes" ("category_id", "is_variant_attribute");
    CREATE INDEX "category_attributes_category_listing_idx" ON "category_attributes" ("category_id", "show_on_listing");
    CREATE INDEX "category_attributes_category_status_deleted_idx" ON "category_attributes" ("category_id", "status", "deleted_at");

    CREATE TABLE "category_attribute_options" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "attribute_id" uuid NOT NULL REFERENCES category_attributes(id) ON DELETE CASCADE,
      "label" varchar(100) NOT NULL,
      "value" varchar(100) NOT NULL,
      "description" varchar(255),
      "display_order" integer DEFAULT 0 NOT NULL,
      "color_hex" varchar(7),
      "image_url" varchar(2048),
      "icon_url" varchar(2048),
      "is_default" boolean DEFAULT false NOT NULL,
      "system_defined" boolean DEFAULT true NOT NULL,
      "status" "public"."catalog_status" DEFAULT 'ACTIVE' NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid REFERENCES seller(id) ON DELETE SET NULL,
      "updated_by" uuid REFERENCES seller(id) ON DELETE SET NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    );

    CREATE UNIQUE INDEX "category_attribute_options_attribute_value_uidx" ON "category_attribute_options" ("attribute_id", "value");
    CREATE UNIQUE INDEX "category_attribute_options_attribute_label_uidx" ON "category_attribute_options" ("attribute_id", "label");
    CREATE INDEX "category_attribute_options_attribute_idx" ON "category_attribute_options" ("attribute_id");
    CREATE INDEX "category_attribute_options_attribute_display_order_idx" ON "category_attribute_options" ("attribute_id", "display_order");
    CREATE INDEX "category_attribute_options_attribute_status_deleted_idx" ON "category_attribute_options" ("attribute_id", "status", "deleted_at");
    CREATE INDEX "category_attribute_options_system_defined_idx" ON "category_attribute_options" ("system_defined");
    CREATE INDEX "category_attribute_options_default_idx" ON "category_attribute_options" ("attribute_id", "is_default");
  `));

  console.log("Tables successfully recreated.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to recreate tables:", err);
  process.exit(1);
});
