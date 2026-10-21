import "dotenv/config";

/**
 * Operator script: promote an existing seller account to platform admin.
 *
 * Public signup always creates `role: "seller"` (the role-escalation hole
 * was closed in Phase 0), so this script is the provisioning path for the
 * first admin — and for every admin after that.
 *
 * Usage:
 *   DATABASE_URL=postgres://... npx tsx scripts/promote-admin.ts <email>
 */
import { promoteSellerToAdmin } from "../../modules/modules/admin/repository/admin.repository";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/promote-admin.ts <seller-email>");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const promoted = await promoteSellerToAdmin(email);
  if (!promoted) {
    console.error(`No seller account found for email: ${email}`);
    process.exit(1);
  }

  console.log(
    `Promoted to admin: ${promoted.name} <${promoted.email}> (id: ${promoted.id})`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("promote-admin failed:", err);
  process.exit(1);
});
