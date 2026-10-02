import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs } from "@/db/schema/autd_activity/audit-log";

export async function findSecurityAlertsForSeller(sellerId: string, limitVal = 5) {
  return db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      userAgent: auditLogs.userAgent,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.actorId, sellerId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limitVal);
}

export async function findAuditLogsForSeller(sellerId: string, limitVal = 10) {
  return db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      changeReason: auditLogs.changeReason,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.actorId, sellerId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limitVal);
}
