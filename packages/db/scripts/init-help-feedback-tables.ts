import * as dotenv from "dotenv";
dotenv.config();
import postgres from "postgres";

let dbUrl = process.env.DATABASE_URL!;
if (dbUrl && dbUrl.includes(":6543")) {
  dbUrl = dbUrl.replace(":6543", ":5432");
  process.env.DATABASE_URL = dbUrl;
}

export async function ensureHelpAndFeedbackTables() {
  const sql = postgres(dbUrl);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "seller_support_tickets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "ticket_number" varchar(32) NOT NULL UNIQUE,
        "subject" varchar(255) NOT NULL,
        "category" varchar(64) DEFAULT 'OTHER' NOT NULL,
        "priority" varchar(32) DEFAULT 'MEDIUM' NOT NULL,
        "status" varchar(32) DEFAULT 'OPEN' NOT NULL,
        "assigned_agent" varchar(128) DEFAULT 'Support Desk' NOT NULL,
        "message" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "support_ticket_messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "ticket_id" uuid NOT NULL REFERENCES seller_support_tickets(id) ON DELETE CASCADE,
        "sender_type" varchar(32) NOT NULL,
        "sender_name" varchar(128) NOT NULL,
        "message" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "knowledge_base_articles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "category" varchar(64) NOT NULL,
        "title" varchar(255) NOT NULL,
        "slug" varchar(255) NOT NULL UNIQUE,
        "description" text NOT NULL,
        "content" text NOT NULL,
        "read_time" varchar(32) DEFAULT '4 min read' NOT NULL,
        "icon" varchar(64) DEFAULT 'BookOpen' NOT NULL,
        "views" integer DEFAULT 0 NOT NULL,
        "helpful_votes" integer DEFAULT 0 NOT NULL,
        "unhelpful_votes" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "seller_academy_progress" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "item_id" varchar(128) NOT NULL,
        "item_type" varchar(32) NOT NULL,
        "progress_percent" integer DEFAULT 0 NOT NULL,
        "is_completed" boolean DEFAULT false NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "seller_callback_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "phone_number" varchar(32) NOT NULL,
        "preferred_time_slot" varchar(64) NOT NULL,
        "reason" text,
        "status" varchar(32) DEFAULT 'PENDING' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "feedback_roadmap_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "category" varchar(64) NOT NULL,
        "status" varchar(32) DEFAULT 'Planned' NOT NULL,
        "upvote_count" integer DEFAULT 0 NOT NULL,
        "comments_count" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "feedback_upvotes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "feature_id" uuid NOT NULL REFERENCES feedback_roadmap_items(id) ON DELETE CASCADE,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "feature_seller_upvote_unique" UNIQUE ("feature_id", "seller_id")
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "feedback_comments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "feature_id" uuid NOT NULL REFERENCES feedback_roadmap_items(id) ON DELETE CASCADE,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "seller_name" varchar(128) NOT NULL,
        "comment" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "seller_feedbacks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "feedback_number" varchar(32) NOT NULL UNIQUE,
        "title" varchar(255) NOT NULL,
        "category" varchar(64) DEFAULT 'Feature Request' NOT NULL,
        "priority" varchar(32) DEFAULT 'Medium' NOT NULL,
        "description" text NOT NULL,
        "device_info" varchar(128),
        "browser_info" varchar(128),
        "app_version" varchar(64),
        "status" varchar(32) DEFAULT 'SUBMITTED' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "seller_surveys" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "seller_id" uuid NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
        "rating" integer NOT NULL,
        "feedback_text" text,
        "context" varchar(128) DEFAULT 'Product Listing Workflow',
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Seed Knowledge Base Articles if empty
    const kbCheck = await sql`SELECT count(*)::int as cnt FROM knowledge_base_articles`;
    if (kbCheck[0]?.cnt === 0) {
      console.log("Seeding Knowledge Base articles into database...");
      await sql`
        INSERT INTO knowledge_base_articles (category, title, slug, description, content, read_time, icon) VALUES
        ('selling', 'Product Photography Tips', 'product-photography-tips', 'How to use optimal lighting to make your boutique catalog stand out.', 'High-quality photography is the cornerstone of online boutique conversions. Ensure consistent neutral background lighting, clear white balance, and multi-angle shots including fabric textures. Use natural daylight whenever possible.', '3 min read', 'Camera'),
        ('selling', 'Product Description Guide', 'product-description-guide', 'Write copy that answers buyer questions before they even ask.', 'Detailed descriptions reduce buyer hesitation and return rates. Include sizing charts, material composition, care instructions, and custom tailoring lead times clearly in your bullet points.', '4 min read', 'FileText'),
        ('selling', 'Pricing & Margin Strategy', 'pricing-margin-strategy', 'Position your custom tailoring competitively in international shipping zones.', 'Calculate your net margins by combining raw material costs, labor hours, platform commission fees, and regional shipping buffers. Maintain at least a 35% gross profit margin.', '5 min read', 'DollarSign'),
        ('delivery', 'Setting Up Local Delivery Radius', 'setting-up-local-delivery-radius', 'Define rules for regional vehicle courier fleets.', 'Configure custom delivery zones by distance or pin code. Assign local courier partners and set variable shipping tiers based on order weight and delivery speed.', '4 min read', 'Truck'),
        ('delivery', 'Self Pickup Configuration', 'self-pickup-configuration', 'Allow local clients to collect purchases from physical fulfillment hubs.', 'Enable click-and-collect options for buyers residing near your boutique workshop. Specify pickup hours, verification pin codes, and holding timeframes.', '3 min read', 'ShoppingBag'),
        ('delivery', 'Packaging Strategy Guide', 'packaging-strategy-guide', 'Protect custom apparel from damage during national transit routes.', 'Use water-resistant poly bags inside rigid box enclosures. Include branded thank-you notes, garment care cards, and tamper-evident seals on every package.', '4 min read', 'Globe'),
        ('payment', 'UPI & Digital Settlement Routing', 'upi-digital-settlement-routing', 'Link active merchant accounts to receive earnings effortlessly.', 'Connect your verified bank account and GSTIN metadata for automated weekly payout processing every Monday morning.', '3 min read', 'DollarSign'),
        ('payment', 'Refund Policy Blueprints', 'refund-policy-blueprints', 'Manage store returns cleanly while preserving buyer trust.', 'Clear return policies increase buyer confidence. Define eligible return windows (e.g. 7 days), store credit options, and return shipping fee responsibilities.', '4 min read', 'FileText');
      `;
    }

    // Seed Feedback Roadmap Items if empty
    const rmCheck = await sql`SELECT count(*)::int as cnt FROM feedback_roadmap_items`;
    if (rmCheck[0]?.cnt === 0) {
      console.log("Seeding Feedback Roadmap items into database...");
      await sql`
        INSERT INTO feedback_roadmap_items (title, description, category, status, upvote_count, comments_count) VALUES
        ('Bulk Inventory CSV Upload Tool', 'Allow sellers to update over 100 stock allocations simultaneously via file spreadsheet dropping.', 'Product Management', 'In Development', 142, 24),
        ('Automated WhatsApp Abandoned Cart Reminders', 'Send automated notification recovery lines when clients leave custom configurations unpaid.', 'Marketing Push', 'Planned', 89, 11),
        ('Dark Mode Interface Layout Theme', 'Complete dark palette stylesheet transformation across the admin panel dashboard grid framework.', 'UI Improvement', 'Released', 310, 45);
      `;
    }

    console.log("Database tables verified and seeded successfully!");
  } finally {
    await sql.end();
  }
}

if (require.main === module) {
  ensureHelpAndFeedbackTables()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error setting up DB tables:", err);
      process.exit(1);
    });
}
