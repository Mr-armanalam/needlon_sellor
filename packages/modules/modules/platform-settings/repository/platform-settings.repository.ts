import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  platformSettings,
  type PlatformSetting,
} from "@/db/schema/platform-settings";

/**
 * Data access for the platform_settings key/value table. Values are stored
 * as JSONB; callers narrow them to the shape they expect.
 */

export async function findPlatformSetting(
  key: string,
): Promise<PlatformSetting | null> {
  const [row] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, key))
    .limit(1);
  return row ?? null;
}

export async function listPlatformSettings(): Promise<PlatformSetting[]> {
  return db.select().from(platformSettings).orderBy(platformSettings.key);
}

export async function upsertPlatformSetting(
  key: string,
  value: unknown,
  updatedBy: string | null,
): Promise<PlatformSetting> {
  const [row] = await db
    .insert(platformSettings)
    .values({ key, value, updatedBy })
    .onConflictDoUpdate({
      target: platformSettings.key,
      set: { value, updatedBy, updatedAt: new Date() },
    })
    .returning();
  return row;
}
