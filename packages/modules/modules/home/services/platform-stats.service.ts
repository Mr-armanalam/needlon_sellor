import { and, count, eq, isNull } from "drizzle-orm";

import { db } from "@needlon/db";
import { seller } from "@needlon/db/db/schema/seller";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { orders } from "@needlon/db/db/schema/orders/table";

/**
 * Live marketplace numbers for the seller landing page.
 *
 * The landing page is rendered on the server; these counts come straight from
 * the production tables so the hero stats are always real. If the database is
 * unreachable (or not configured), curated fallback figures are used so the
 * marketing page never breaks.
 */
export interface PlatformStats {
  sellers: number;
  products: number;
  orders: number;
  bespokeOrders: number;
  /** True when the numbers came from the database. */
  live: boolean;
}

const FALLBACK_STATS: PlatformStats = {
  sellers: 850,
  products: 6200,
  orders: 12400,
  bespokeOrders: 3100,
  live: false,
};

let cached: { stats: PlatformStats; fetchedAt: number } | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour, aligned with the page revalidation

export async function getPlatformStats(): Promise<PlatformStats> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return cached.stats;
  }

  if (!process.env.DATABASE_URL) {
    return FALLBACK_STATS;
  }

  try {
    const [sellerRow] = await db.select({ value: count() }).from(seller);
    const [productRow] = await db
      .select({ value: count() })
      .from(productsTable)
      .where(isNull(productsTable.deletedAt));
    const [orderRow] = await db
      .select({ value: count() })
      .from(orders)
      .where(isNull(orders.deletedAt));
    const [bespokeRow] = await db
      .select({ value: count() })
      .from(orders)
      .where(
        and(eq(orders.source, "IN_STORE"), isNull(orders.deletedAt))
      );

    const stats: PlatformStats = {
      sellers: sellerRow?.value ?? 0,
      products: productRow?.value ?? 0,
      orders: orderRow?.value ?? 0,
      bespokeOrders: bespokeRow?.value ?? 0,
      live: true,
    };
    cached = { stats, fetchedAt: Date.now() };
    return stats;
  } catch {
    return FALLBACK_STATS;
  }
}

/** Compact display formatting: 12400 -> "12.4k", 850 -> "850". */
export function formatStat(value: number): string {
  if (value >= 1000) {
    const compact = value / 1000;
    return `${compact >= 100 ? Math.round(compact) : compact.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${value}`;
}
