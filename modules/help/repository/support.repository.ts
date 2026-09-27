import { CreateSupportTicketDto } from "../dto/support.dto";

// In-memory or database support tickets storage
const sellerTicketsStore: Map<string, any[]> = new Map();

export async function createSupportTicketRepo(sellerId: string, dto: CreateSupportTicketDto) {
  const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  const ticket = {
    id: `tkt-${Date.now()}`,
    sellerId,
    ticketNumber,
    subject: dto.subject,
    category: dto.category,
    priority: dto.priority,
    status: "OPEN",
    message: dto.message,
    createdAt: new Date().toISOString(),
  };

  if (!sellerTicketsStore.has(sellerId)) {
    sellerTicketsStore.set(sellerId, []);
  }
  sellerTicketsStore.get(sellerId)!.unshift(ticket);
  return ticket;
}

export async function getSellerSupportTicketsRepo(sellerId: string) {
  if (!sellerTicketsStore.has(sellerId)) {
    // Seed default welcome support ticket for preview
    sellerTicketsStore.set(sellerId, [
      {
        id: "tkt-default-1",
        sellerId,
        ticketNumber: "TKT-884920",
        subject: "Welcome to Needlon Seller Support",
        category: "OTHER",
        priority: "LOW",
        status: "RESOLVED",
        message: "Your seller account setup was verified successfully. Contact us here for any platform assistance.",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ]);
  }
  return sellerTicketsStore.get(sellerId)!;
}
