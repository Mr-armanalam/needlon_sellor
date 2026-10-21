import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { seller } from "@/db/schema/seller";
import { sellerStore } from "@/db/schema/seller/seller-store";
import {
  sellerSupportTickets,
  supportTicketMessages,
} from "@/db/schema/help";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
  AdminSupportMessageDto,
  AdminSupportThreadDto,
  AdminSupportTicketDto,
  SupportTicketStatusDto,
} from "../dto/admin.dto";

/**
 * Staff side of seller support. The seller-facing module
 * (modules/help/repository/support.repository.ts) scopes every read and
 * write to the owning seller; these functions are the platform-wide
 * counterparts for the admin inbox and must only be reached through
 * requireAdmin()-guarded routes.
 */

type TicketJoinRow = {
  id: string;
  ticketNumber: string;
  sellerId: string;
  sellerName: string;
  storeName: string | null;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assignedAgent: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

const ticketSelection = {
  id: sellerSupportTickets.id,
  ticketNumber: sellerSupportTickets.ticketNumber,
  sellerId: sellerSupportTickets.sellerId,
  sellerName: seller.name,
  storeName: sellerStore.storeName,
  subject: sellerSupportTickets.subject,
  category: sellerSupportTickets.category,
  priority: sellerSupportTickets.priority,
  status: sellerSupportTickets.status,
  assignedAgent: sellerSupportTickets.assignedAgent,
  message: sellerSupportTickets.message,
  createdAt: sellerSupportTickets.createdAt,
  updatedAt: sellerSupportTickets.updatedAt,
};

function toTicketDto(
  row: TicketJoinRow,
  messageCount: number,
  lastMessage: AdminSupportTicketDto["lastMessage"],
): AdminSupportTicketDto {
  return { ...row, messageCount, lastMessage };
}

async function fetchTicketRow(
  ticketId: string,
): Promise<TicketJoinRow | null> {
  const [row] = await db
    .select(ticketSelection)
    .from(sellerSupportTickets)
    .innerJoin(seller, eq(seller.id, sellerSupportTickets.sellerId))
    .leftJoin(sellerStore, eq(sellerStore.sellerId, sellerSupportTickets.sellerId))
    .where(eq(sellerSupportTickets.id, ticketId))
    .limit(1);
  return row ?? null;
}

async function fetchTicketDto(
  ticketId: string,
): Promise<AdminSupportTicketDto> {
  const row = await fetchTicketRow(ticketId);
  if (!row) throw new NotFoundError("Support ticket not found.");

  const messages = await db
    .select()
    .from(supportTicketMessages)
    .where(eq(supportTicketMessages.ticketId, ticketId))
    .orderBy(desc(supportTicketMessages.createdAt));

  const latest = messages[0];
  return toTicketDto(row, messages.length, latest ? {
    message: latest.message,
    senderType: latest.senderType,
    senderName: latest.senderName,
    createdAt: latest.createdAt,
  } : null);
}

export interface ListAdminSupportTicketsFilter {
  status?: string;
  search?: string;
}

/** Every seller's tickets, newest activity first, for the staff inbox. */
export async function listAdminSupportTickets(
  filter: ListAdminSupportTicketsFilter = {},
): Promise<AdminSupportTicketDto[]> {
  const searchTerm =
    filter.search && filter.search.trim().length > 0
      ? `%${filter.search.trim()}%`
      : null;
  const whereClause = and(
    filter.status && filter.status !== "ALL"
      ? eq(sellerSupportTickets.status, filter.status)
      : undefined,
    searchTerm
      ? or(
          ilike(sellerSupportTickets.subject, searchTerm),
          ilike(sellerSupportTickets.ticketNumber, searchTerm),
          ilike(seller.name, searchTerm),
        )
      : undefined,
  );

  const rows = await db
    .select({
      ...ticketSelection,
      // Raw qualified reference: interpolating the column object would
      // emit an unqualified "id", which inside the subquery binds to
      // support_ticket_messages.id instead of the ticket's id.
      messageCount: sql<number>`(
        SELECT count(*)::int FROM support_ticket_messages
        WHERE support_ticket_messages.ticket_id = seller_support_tickets.id
      )`,
    })
    .from(sellerSupportTickets)
    .innerJoin(seller, eq(seller.id, sellerSupportTickets.sellerId))
    .leftJoin(sellerStore, eq(sellerStore.sellerId, sellerSupportTickets.sellerId))
    .where(whereClause)
    .orderBy(desc(sellerSupportTickets.updatedAt));

  if (rows.length === 0) return [];

  // Latest message per ticket in one round-trip (DISTINCT ON), merged in JS.
  const ticketIds = rows.map((row) => row.id);
  const latestMessages = await db
    .selectDistinctOn([supportTicketMessages.ticketId], {
      ticketId: supportTicketMessages.ticketId,
      message: supportTicketMessages.message,
      senderType: supportTicketMessages.senderType,
      senderName: supportTicketMessages.senderName,
      createdAt: supportTicketMessages.createdAt,
    })
    .from(supportTicketMessages)
    .where(inArray(supportTicketMessages.ticketId, ticketIds))
    .orderBy(
      supportTicketMessages.ticketId,
      desc(supportTicketMessages.createdAt),
    );

  const latestByTicket = new Map(
    latestMessages.map((m) => [m.ticketId, m]),
  );

  return rows.map((row) => {
    const latest = latestByTicket.get(row.id);
    return toTicketDto(row, row.messageCount ?? 0, latest ? {
      message: latest.message,
      senderType: latest.senderType,
      senderName: latest.senderName,
      createdAt: latest.createdAt,
    } : null);
  });
}

/** One ticket plus its full conversation, oldest first. */
export async function getAdminSupportTicketThread(
  ticketId: string,
): Promise<AdminSupportThreadDto> {
  const ticket = await fetchTicketDto(ticketId);

  const messages = await db
    .select()
    .from(supportTicketMessages)
    .where(eq(supportTicketMessages.ticketId, ticketId))
    .orderBy(supportTicketMessages.createdAt);

  return {
    ticket,
    messages: messages.map(
      (m): AdminSupportMessageDto => ({
        id: m.id,
        ticketId: m.ticketId,
        senderType: m.senderType,
        senderName: m.senderName,
        message: m.message,
        createdAt: m.createdAt,
      }),
    ),
  };
}

/**
 * Post a staff reply. The message lands in the same timeline the seller
 * reads (senderType 'agent'), the ticket is stamped with the responding
 * agent, and an OPEN or RESOLVED ticket moves to IN_PROGRESS so the
 * seller sees it is being handled. Returns the refreshed thread.
 */
export async function replyAsAgent(
  ticketId: string,
  agentSellerId: string,
  message: string,
): Promise<AdminSupportThreadDto> {
  const row = await fetchTicketRow(ticketId);
  if (!row) throw new NotFoundError("Support ticket not found.");

  const [agent] = await db
    .select({ name: seller.name })
    .from(seller)
    .where(eq(seller.id, agentSellerId))
    .limit(1);
  const agentName = agent?.name ?? "Support Desk";

  await db.insert(supportTicketMessages).values({
    ticketId,
    senderType: "agent",
    senderName: agentName,
    message,
  });

  const nextStatus =
    row.status === "OPEN" || row.status === "RESOLVED"
      ? "IN_PROGRESS"
      : row.status;

  await db
    .update(sellerSupportTickets)
    .set({
      status: nextStatus,
      assignedAgent: agentName,
      updatedAt: new Date(),
    })
    .where(eq(sellerSupportTickets.id, ticketId));

  return getAdminSupportTicketThread(ticketId);
}

/** Staff status control over the same status values the seller side uses. */
export async function setAdminTicketStatus(
  ticketId: string,
  status: SupportTicketStatusDto,
): Promise<AdminSupportTicketDto> {
  const row = await fetchTicketRow(ticketId);
  if (!row) throw new NotFoundError("Support ticket not found.");

  await db
    .update(sellerSupportTickets)
    .set({ status, updatedAt: new Date() })
    .where(eq(sellerSupportTickets.id, ticketId));

  return fetchTicketDto(ticketId);
}
