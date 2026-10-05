import { db } from "@needlon/db";
import { sellerSupportTickets, supportTicketMessages } from "@needlon/db/db/schema/help";
import { eq, and, desc } from "drizzle-orm";
import { CreateSupportTicketDto } from "../dto/support.dto";

export async function createSupportTicketRepo(sellerId: string, dto: CreateSupportTicketDto) {
  const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

  const [ticket] = await db
    .insert(sellerSupportTickets)
    .values({
      sellerId,
      ticketNumber,
      subject: dto.subject,
      category: dto.category,
      priority: dto.priority,
      status: "OPEN",
      assignedAgent: "Support Desk",
      message: dto.message,
    })
    .returning();

  // Create initial message in timeline
  await db.insert(supportTicketMessages).values({
    ticketId: ticket.id,
    senderType: "seller",
    senderName: "Seller",
    message: dto.message,
  });

  return ticket;
}

export async function getSellerSupportTicketsRepo(sellerId: string) {
  const tickets = await db
    .select()
    .from(sellerSupportTickets)
    .where(eq(sellerSupportTickets.sellerId, sellerId))
    .orderBy(desc(sellerSupportTickets.createdAt));

  if (tickets.length === 0) {
    // Seed welcome support ticket into DB for first-time seller
    const ticketNumber = `TKT-884920`;
    const [welcomeTicket] = await db
      .insert(sellerSupportTickets)
      .values({
        sellerId,
        ticketNumber,
        subject: "Welcome to Needlon Seller Support",
        category: "OTHER",
        priority: "LOW",
        status: "RESOLVED",
        assignedAgent: "Onboarding Specialist",
        message: "Your seller account setup was verified successfully. Contact us here for any platform assistance.",
      })
      .returning();

    await db.insert(supportTicketMessages).values({
      ticketId: welcomeTicket.id,
      senderType: "agent",
      senderName: "Onboarding Specialist",
      message: "Your seller account setup was verified successfully. Contact us here for any platform assistance.",
    });

    return [welcomeTicket];
  }

  return tickets;
}

export async function getTicketDetailsRepo(sellerId: string, ticketIdOrNumber: string) {
  const [ticket] = await db
    .select()
    .from(sellerSupportTickets)
    .where(
      and(
        eq(sellerSupportTickets.sellerId, sellerId),
        eq(sellerSupportTickets.id, ticketIdOrNumber)
      )
    );

  if (!ticket) {
    const [ticketByNum] = await db
      .select()
      .from(sellerSupportTickets)
      .where(
        and(
          eq(sellerSupportTickets.sellerId, sellerId),
          eq(sellerSupportTickets.ticketNumber, ticketIdOrNumber)
        )
      );
    if (!ticketByNum) return null;
    
    const timeline = await db
      .select()
      .from(supportTicketMessages)
      .where(eq(supportTicketMessages.ticketId, ticketByNum.id))
      .orderBy(supportTicketMessages.createdAt);
      
    return { ...ticketByNum, timeline };
  }

  const timeline = await db
    .select()
    .from(supportTicketMessages)
    .where(eq(supportTicketMessages.ticketId, ticket.id))
    .orderBy(supportTicketMessages.createdAt);

  return { ...ticket, timeline };
}

export async function addTicketMessageRepo(
  sellerId: string,
  ticketId: string,
  senderType: "seller" | "agent" | "system",
  senderName: string,
  message: string
) {
  const ticketData = await getTicketDetailsRepo(sellerId, ticketId);
  if (!ticketData) throw new Error("Ticket not found or access denied");

  const [newMessage] = await db
    .insert(supportTicketMessages)
    .values({
      ticketId: ticketData.id,
      senderType,
      senderName,
      message,
    })
    .returning();

  // If status is closed and seller sends message, reopen
  if (ticketData.status === "CLOSED" && senderType === "seller") {
    await db
      .update(sellerSupportTickets)
      .set({ status: "OPEN", updatedAt: new Date() })
      .where(eq(sellerSupportTickets.id, ticketData.id));
  }

  return newMessage;
}

export async function updateTicketStatusRepo(
  sellerId: string,
  ticketId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
) {
  const ticketData = await getTicketDetailsRepo(sellerId, ticketId);
  if (!ticketData) throw new Error("Ticket not found or access denied");

  const [updatedTicket] = await db
    .update(sellerSupportTickets)
    .set({ status, updatedAt: new Date() })
    .where(eq(sellerSupportTickets.id, ticketData.id))
    .returning();

  return updatedTicket;
}
