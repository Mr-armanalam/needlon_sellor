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

    // 2b. Add revision columns to customer_measurements if missing
    await sql`
      ALTER TABLE customer_measurements 
      ADD COLUMN IF NOT EXISTS is_editable BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS edit_requested BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS edit_request_reason TEXT,
      ADD COLUMN IF NOT EXISTS edit_requested_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ;
    `;
    // 2c. Add media_urls column to product_orders for bespoke garment photos and videos
    await sql`
      ALTER TABLE product_orders 
      ADD COLUMN IF NOT EXISTS media_urls JSONB DEFAULT '[]'::jsonb;
    `;
    console.log("✓ Verified product_orders media_urls column.");

    // 2d. Add order_id column to chat_permissions for order-scoped conversations
    await sql`
      ALTER TABLE chat_permissions 
      ADD COLUMN IF NOT EXISTS order_id UUID;
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_permissions_order 
      ON chat_permissions(order_id);
    `;
    console.log("✓ Verified chat_permissions order_id column and index.");

    // 2e. Add conversation_type, order_id and buyer_id columns to conversations
    await sql`
      ALTER TABLE conversations 
      ADD COLUMN IF NOT EXISTS conversation_type VARCHAR(50) DEFAULT 'GENERAL',
      ADD COLUMN IF NOT EXISTS order_id UUID,
      ADD COLUMN IF NOT EXISTS buyer_id UUID,
      ADD COLUMN IF NOT EXISTS seller_id UUID,
      ADD COLUMN IF NOT EXISTS product_id UUID,
      ADD COLUMN IF NOT EXISTS last_message_id UUID,
      ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_order ON conversations(order_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON conversations(buyer_id);
    `;
    console.log("✓ Verified conversations columns and indexes.");

    // 2f. Ensure messages table exists and has required columns
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL,
        sender_type VARCHAR(50) NOT NULL DEFAULT 'BUYER',
        sender_id UUID,
        message_type VARCHAR(50) DEFAULT 'TEXT' NOT NULL,
        content TEXT,
        reply_to_message_id UUID,
        related_product_id UUID,
        related_order_id UUID,
        sequence_number BIGINT NOT NULL DEFAULT 1,
        is_edited BOOLEAN DEFAULT FALSE,
        edited_at TIMESTAMPTZ,
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      ALTER TABLE messages
      ADD COLUMN IF NOT EXISTS sequence_number BIGINT DEFAULT 1,
      ADD COLUMN IF NOT EXISTS conversation_id UUID,
      ADD COLUMN IF NOT EXISTS sender_type VARCHAR(50) DEFAULT 'BUYER',
      ADD COLUMN IF NOT EXISTS sender_id UUID,
      ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'TEXT',
      ADD COLUMN IF NOT EXISTS content TEXT,
      ADD COLUMN IF NOT EXISTS related_order_id UUID,
      ADD COLUMN IF NOT EXISTS related_product_id UUID,
      ADD COLUMN IF NOT EXISTS reply_to_message_id UUID,
      ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    `;
    await sql`
      ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_seller_id_fk;
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conv_seq ON messages(conversation_id, sequence_number);
    `;
    console.log("✓ Verified messages table and indexes.");

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
