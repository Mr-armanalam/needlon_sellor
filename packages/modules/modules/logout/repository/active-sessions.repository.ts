import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

export async function findActiveSessionsForSeller(sellerId: string) {
  return db
    .select({
      id: sessions.id,
      userAgent: sessions.userAgent,
      ipAddress: sessions.ipAddress,
      createdAt: sessions.createdAt,
      updatedAt: sessions.updatedAt,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.sellerId, sellerId),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date())
      )
    )
    .orderBy(desc(sessions.updatedAt));
}
