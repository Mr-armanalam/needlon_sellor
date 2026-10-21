import {
  findPlatformSetting,
  listPlatformSettings,
  upsertPlatformSetting,
} from "../repository/platform-settings.repository";
import type { PlatformSetting } from "@/db/schema/platform-settings";

/**
 * Platform settings service — the single read path for platform-wide
 * configuration owned by the admin surface (commission rate, feature
 * values, ...). Reads are cached in-memory for 60 seconds because settings
 * change rarely and several hot paths (dashboard, earnings) read the
 * commission rate on every request.
 */

export const COMMISSION_RATE_KEY = "commissionRate";

/** Historical platform default; used only if the seeded row is missing. */
export const DEFAULT_COMMISSION_RATE = 0.05;

const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function readCache(key: string): { hit: boolean; value: unknown } {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return { hit: true, value: entry.value };
  }
  return { hit: false, value: undefined };
}

function writeCache(key: string, value: unknown): void {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Returns the raw JSON value for a setting, or null when unset. */
export async function getPlatformSetting(key: string): Promise<unknown> {
  const cached = readCache(key);
  if (cached.hit) return cached.value;

  const row = await findPlatformSetting(key);
  const value = row ? row.value : null;
  writeCache(key, value);
  return value;
}

export async function setPlatformSetting(
  key: string,
  value: unknown,
  updatedBy: string | null,
): Promise<PlatformSetting> {
  const row = await upsertPlatformSetting(key, value, updatedBy);
  // Refresh the cache entry so subsequent reads in this process see the
  // new value immediately instead of waiting for the TTL.
  writeCache(key, row.value);
  return row;
}

export async function listPlatformSettingsService(): Promise<
  PlatformSetting[]
> {
  return listPlatformSettings();
}

/**
 * The marketplace commission rate as a fraction in [0, 1) — e.g. 0.05 = 5%.
 * Falls back to the historical 5% default when the row is missing or does
 * not hold a valid number; the row is seeded by sync-all-schemas, so the
 * fallback is a shouldn't-happen safety net, not the source of truth.
 */
export async function getCommissionRate(): Promise<number> {
  const value = await getPlatformSetting(COMMISSION_RATE_KEY);
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value < 1
  ) {
    return value;
  }
  return DEFAULT_COMMISSION_RATE;
}
