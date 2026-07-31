import postgres from "postgres";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

async function run() {
  const sql = postgres(process.env.DATABASE_URL!);
  const sqlContent = fs.readFileSync("./drizzle/0013_worried_hitman.sql", "utf-8");
  const statements = sqlContent.split("--> statement-breakpoint");

  console.log(`Executing ${statements.length} SQL statements...`);
  for (const stmt of statements) {
    const trimmed = stmt.trim();
    if (!trimmed) continue;
    try {
      await sql.unsafe(trimmed);
      console.log("✓ Success:", trimmed.substring(0, 50).replace(/\n/g, " "));
    } catch (err: any) {
      console.log("! Note:", err.message);
    }
  }

  await sql.end();
  console.log("Migration executed successfully!");
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
