/**
 * check-live-schema.ts — read-only check: does the LIVE database match the app code?
 *
 * Run it from packages/db, exactly like the other setup scripts:
 *
 *     pnpm exec tsx scripts/check-live-schema.ts
 *
 * What it does:
 *   - Reads DATABASE_URL only from your existing environment files
 *     (the repo-root .env first — the same one the apps run on — then
 *     packages/db/.env / .env.local, then your shell). It never asks for,
 *     prints, or stores the password.
 *   - Looks at the live database structure only (information_schema plus two
 *     seed-row lookups). It writes nothing, migrates nothing, deletes nothing,
 *     and it is safe to run as many times as you like.
 *   - Prints every table / column / seed row the setup sequence is supposed
 *     to have created, and for anything missing, the ONE setup step to rerun.
 *
 * Exit codes: 0 = everything present, 1 = something missing, 2 = could not
 * read or connect (the message explains which).
 */
import * as dotenv from "dotenv";
import postgres from "postgres";

/* ------------------------------------------------------------------ */
/* Connection string: from your existing environment only              */
/* ------------------------------------------------------------------ */

// Loaded lowest-priority first with override on, so the repo-root .env —
// the file the apps actually run on — wins over a stale shell export.
// (A $env:DATABASE_URL left in an old terminal is how a quoted/old string
// once shadowed the good one; this check must probe the apps' database.)
const envFiles: string[] = [
  ".env.local",
  ".env",
  "../../.env.local",
  "../../.env",
];
let envSource = "your shell environment";
for (const path of envFiles) {
  const result = dotenv.config({ path, override: true, quiet: true });
  if (!result.error && result.parsed && "DATABASE_URL" in result.parsed) {
    envSource = path;
  }
}

const rawUrl: string | undefined = process.env.DATABASE_URL;

if (!rawUrl) {
  console.error(
    [
      "DATABASE_URL was not found in any of these places:",
      "  - the repo-root .env / .env.local",
      "  - packages/db/.env / .env.local",
      "  - your shell environment",
      "Add it to the repo-root .env (the same one the apps use) and run this again.",
    ].join("\n"),
  );
  process.exit(2);
}

// A value wrapped in quotes in the file is fine for the apps (their loader
// strips them); strip them here too so the string parses.
const connectionString: string = rawUrl.trim().replace(/^["']|["']$/g, "");

let parsedUrl: URL;
try {
  parsedUrl = new URL(connectionString);
} catch {
  console.error(
    `DATABASE_URL (from ${envSource}) is not a valid connection string — it does not parse as a URL.\n` +
      "Open that file and make sure the value is one unbroken postgresql:// string.",
  );
  process.exit(2);
}

/* ------------------------------------------------------------------ */
/* What the setup sequence is supposed to have created                 */
/* ------------------------------------------------------------------ */

const MIGRATE = "pnpm exec tsx db/migrate.ts";
const SYNC_ALL = "pnpm exec tsx scripts/sync-all-schemas.ts";
const INIT_BESPOKE = "pnpm exec tsx scripts/init-bespoke-tables.ts";
const INIT_CLIENT = "pnpm exec tsx scripts/init-client-tables.ts";
const INIT_HELP = "pnpm exec tsx scripts/init-help-feedback-tables.ts";
const INIT_PHASE1 = "pnpm exec tsx scripts/init-phase1-schemas.ts";
const INIT_PHASE4 = "pnpm exec tsx scripts/init-phase4-schemas.ts";
const SYNC_COLUMNS = "pnpm exec tsx scripts/sync-missing-columns.ts";
const SEED_PARTNERS = "pnpm exec tsx scripts/seed-delivery-partners.ts";

interface TableProbe {
  kind: "table";
  table: string;
  step: string;
}

interface ColumnProbe {
  kind: "column";
  table: string;
  column: string;
  step: string;
}

type Probe = TableProbe | ColumnProbe;

const PROBES: Probe[] = [
  // Base schema sanity — created by the Drizzle migrations.
  { kind: "table", table: "seller", step: MIGRATE },
  { kind: "table", table: "users", step: MIGRATE },
  { kind: "table", table: "seller_store", step: MIGRATE },
  { kind: "table", table: "products", step: MIGRATE },
  { kind: "table", table: "product_orders", step: MIGRATE },
  { kind: "table", table: "shipment_orders", step: MIGRATE },

  // sync-all-schemas.ts — tables
  { kind: "table", table: "brands", step: SYNC_ALL },
  { kind: "table", table: "seller_payout_requests", step: SYNC_ALL },
  { kind: "table", table: "delivery_executives", step: SYNC_ALL },
  { kind: "table", table: "delivery_assignments", step: SYNC_ALL },
  { kind: "table", table: "seller_delivery_settings", step: SYNC_ALL },
  { kind: "table", table: "seller_shipping_zones", step: SYNC_ALL },
  { kind: "table", table: "seller_carrier_connections", step: SYNC_ALL },
  { kind: "table", table: "platform_settings", step: SYNC_ALL },

  // sync-all-schemas.ts — added columns
  { kind: "column", table: "seller", column: "is_active", step: SYNC_ALL },
  { kind: "column", table: "seller_payout_requests", column: "deleted_at", step: SYNC_ALL },
  { kind: "column", table: "delivery_assignments", column: "completed_at", step: SYNC_ALL },
  { kind: "column", table: "shipment_orders", column: "executive_id", step: SYNC_ALL },
  { kind: "column", table: "shipment_orders", column: "label_url", step: SYNC_ALL },
  { kind: "column", table: "shipment_orders", column: "label_generated_at", step: SYNC_ALL },
  { kind: "column", table: "shipping_methods", column: "base_charge", step: SYNC_ALL },
  { kind: "column", table: "shipping_methods", column: "per_kg_charge", step: SYNC_ALL },
  { kind: "column", table: "shipping_partners", column: "api_base_url", step: SYNC_ALL },
  { kind: "column", table: "shipping_partners", column: "integration_type", step: SYNC_ALL },
  { kind: "column", table: "knowledge_base_articles", column: "is_published", step: SYNC_ALL },
  { kind: "column", table: "products", column: "brand_id", step: SYNC_ALL },
  { kind: "column", table: "products", column: "brand_name", step: SYNC_ALL },
  { kind: "column", table: "products", column: "subcategory_id", step: SYNC_ALL },
  { kind: "column", table: "product_variants", column: "estimated_delivery_window", step: SYNC_ALL },
  { kind: "column", table: "pricing", column: "discount_rate", step: SYNC_ALL },

  // init-bespoke-tables.ts
  { kind: "column", table: "products", column: "is_customizable", step: INIT_BESPOKE },
  { kind: "table", table: "customer_measurements", step: INIT_BESPOKE },
  { kind: "table", table: "messages", step: INIT_BESPOKE },
  { kind: "table", table: "notifications", step: INIT_BESPOKE },
  { kind: "table", table: "chat_permissions", step: INIT_BESPOKE },

  // init-client-tables.ts
  { kind: "table", table: "client_carts", step: INIT_CLIENT },
  { kind: "table", table: "client_cart_items", step: INIT_CLIENT },
  { kind: "table", table: "client_wishlists", step: INIT_CLIENT },
  { kind: "table", table: "client_hero_banners", step: INIT_CLIENT },
  { kind: "table", table: "client_loyalty_accounts", step: INIT_CLIENT },
  { kind: "table", table: "client_recently_viewed", step: INIT_CLIENT },
  { kind: "table", table: "client_search_history", step: INIT_CLIENT },
  { kind: "table", table: "user_addresses", step: INIT_CLIENT },

  // init-help-feedback-tables.ts
  { kind: "table", table: "knowledge_base_articles", step: INIT_HELP },
  { kind: "table", table: "seller_support_tickets", step: INIT_HELP },
  { kind: "table", table: "support_ticket_messages", step: INIT_HELP },
  { kind: "table", table: "seller_feedbacks", step: INIT_HELP },
  { kind: "table", table: "feedback_comments", step: INIT_HELP },
  { kind: "table", table: "feedback_upvotes", step: INIT_HELP },
  { kind: "table", table: "feedback_roadmap_items", step: INIT_HELP },
  { kind: "table", table: "seller_surveys", step: INIT_HELP },
  { kind: "table", table: "seller_callback_requests", step: INIT_HELP },
  { kind: "table", table: "seller_academy_progress", step: INIT_HELP },

  // init-phase1-schemas.ts / init-phase4-schemas.ts
  { kind: "table", table: "seller_customers", step: INIT_PHASE1 },
  { kind: "table", table: "fitting_appointments", step: INIT_PHASE4 },

  // sync-missing-columns.ts
  { kind: "column", table: "product_variants", column: "variant_name", step: SYNC_COLUMNS },
];

/* Seed rows the sequence is supposed to leave behind. */
interface SeedProbe {
  label: string;
  present: boolean;
  step: string;
}

interface TableNameRow {
  table_name: string;
}

interface ColumnNameRow {
  table_name: string;
  column_name: string;
}

interface KeyRow {
  key: string;
}

interface PartnerCodeRow {
  partner_code: string;
}

function errorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code: unknown = (err as { code: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

async function main(): Promise<void> {
  console.log("Needlon live database check (read-only — nothing is written or changed)");
  console.log(
    `Connection string: from ${envSource}; host ${parsedUrl.hostname}, port ${parsedUrl.port || "5432"}`,
  );

  const sql = postgres(connectionString, { max: 1, connect_timeout: 10 });

  try {
    const tableRows = await sql<TableNameRow[]>`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `;
    const columnRows = await sql<ColumnNameRow[]>`
      SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public'
    `;

    const tables = new Set<string>(tableRows.map((r) => r.table_name));
    const columns = new Set<string>(
      columnRows.map((r) => `${r.table_name}.${r.column_name}`),
    );

    const seedProbes: SeedProbe[] = [];
    if (tables.has("platform_settings")) {
      const rows = await sql<KeyRow[]>`
        SELECT key FROM platform_settings WHERE key = 'commissionRate'
      `;
      seedProbes.push({
        label: "platform_settings row 'commissionRate' (the platform commission setting)",
        present: rows.length > 0,
        step: SYNC_ALL,
      });
    }
    if (tables.has("shipping_partners")) {
      const rows = await sql<PartnerCodeRow[]>`
        SELECT partner_code FROM shipping_partners WHERE partner_code IN ('SHIPROCKET', 'INHOUSE')
      `;
      const codes = new Set<string>(rows.map((r) => r.partner_code));
      seedProbes.push({
        label: "shipping_partners row 'SHIPROCKET' (the carrier partner)",
        present: codes.has("SHIPROCKET"),
        step: SEED_PARTNERS,
      });
      seedProbes.push({
        label: "shipping_partners row 'INHOUSE' (your own delivery fleet)",
        present: codes.has("INHOUSE"),
        step: SEED_PARTNERS,
      });
    }

    const missingByStep = new Map<string, string[]>();
    let presentCount = 0;

    const noteMissing = (step: string, label: string): void => {
      const list = missingByStep.get(step) ?? [];
      list.push(label);
      missingByStep.set(step, list);
    };

    for (const probe of PROBES) {
      if (probe.kind === "table") {
        if (tables.has(probe.table)) {
          presentCount += 1;
        } else {
          noteMissing(probe.step, `table "${probe.table}"`);
        }
      } else if (!tables.has(probe.table)) {
        noteMissing(probe.step, `column "${probe.table}.${probe.column}" (its table is missing too)`);
      } else if (columns.has(`${probe.table}.${probe.column}`)) {
        presentCount += 1;
      } else {
        noteMissing(probe.step, `column "${probe.table}.${probe.column}"`);
      }
    }

    for (const seed of seedProbes) {
      if (seed.present) {
        presentCount += 1;
      } else {
        noteMissing(seed.step, seed.label);
      }
    }

    const totalCount = PROBES.length + seedProbes.length;

    if (missingByStep.size === 0) {
      console.log(
        `\nAll ${totalCount} checked items are present — the live database matches what the app code expects.`,
      );
      return;
    }

    console.log(`\n${presentCount} of ${totalCount} checked items are present. Missing:`);
    for (const [step, items] of missingByStep) {
      console.log(`\nRerun this step:  ${step}`);
      for (const item of items) {
        console.log(`  - missing ${item}`);
      }
    }
    console.log(
      "\nRun only the step(s) listed above, from packages/db, then run this check again.",
    );
    process.exitCode = 1;
  } catch (err: unknown) {
    const code = errorCode(err);
    if (code === "28P01") {
      console.error(
        "\nThe database rejected the login in DATABASE_URL (password authentication failed).\n" +
          "For the Supabase pooler the username in the string must be postgres.<your-project-ref> — " +
          "if the username was changed by hand, paste the exact URI from the Supabase dashboard (Connect) instead.",
      );
    } else if (code === "3D000") {
      console.error("\nThe connection string points at a database that does not exist on that host.");
    } else {
      console.error(
        `\nCould not reach the database (${code ?? "connection error"}). ` +
          "Check that the host and port in DATABASE_URL are the Supabase pooler ones and that this machine is online.",
      );
    }
    process.exitCode = 2;
  } finally {
    await sql.end();
  }
}

void main();
