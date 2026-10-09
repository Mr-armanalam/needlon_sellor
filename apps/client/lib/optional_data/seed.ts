import "dotenv/config"; // 👈 REQUIRED
import { seedProductFilterOptions } from "./seed-product-filter-options";

async function seed() {
  try {
    console.log("🌱 Seeding product_filter_options...");
    await seedProductFilterOptions();
    console.log("✅ Done");
  } catch (err) {
    console.error("❌ Seed failed", err);
  } finally {
    process.exit(0);
  }
}

seed();
