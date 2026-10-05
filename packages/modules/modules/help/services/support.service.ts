import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  createSupportTicketRepo,
  getSellerSupportTicketsRepo,
  getTicketDetailsRepo,
  addTicketMessageRepo,
  updateTicketStatusRepo,
} from "../repository/support.repository";
import { CreateSupportTicketDto } from "../dto/support.dto";

export async function getSellerSupportTicketsService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerSupportTicketsRepo(seller.id);
}

export async function createSupportTicketService(dto: CreateSupportTicketDto) {
  const seller = await getCurrentSellerOrThrow();
  return createSupportTicketRepo(seller.id, dto);
}

export async function getTicketDetailsService(ticketId: string) {
  const seller = await getCurrentSellerOrThrow();
  return getTicketDetailsRepo(seller.id, ticketId);
}

export async function addTicketMessageService(ticketId: string, message: string) {
  const seller = await getCurrentSellerOrThrow();
  return addTicketMessageRepo(seller.id, ticketId, "seller", seller.name || "Seller", message);
}

export async function updateTicketStatusService(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  const seller = await getCurrentSellerOrThrow();
  return updateTicketStatusRepo(seller.id, ticketId, status);
}
