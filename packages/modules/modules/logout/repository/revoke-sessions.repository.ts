import { and, eq, ne, isNull } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

export async function revokeSessionsExcept(
  sellerId: string,
  currentSessionId?: string
) {
  const conditions = [
    eq(sessions.sellerId, sellerId),
    isNull(sessions.revokedAt),
  ];
  
  if (currentSessionId) {
    conditions.push(ne(sessions.id, currentSessionId));
  }

  return db
    .update(sessions)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(...conditions))
    .returning({ id: sessions.id });
}

export async function revokeSessionById(sessionId: string, sellerId: string) {
  return db
    .update(sessions)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(sessions.id, sessionId), eq(sessions.sellerId, sellerId)))
    .returning({ id: sessions.id });
}
