import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { createSupportTicketRepo, getSellerSupportTicketsRepo } from "../repository/support.repository";
import { CreateSupportTicketDto } from "../dto/support.dto";

export async function getSellerSupportTicketsService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerSupportTicketsRepo(seller.id);
}

export async function createSupportTicketService(dto: CreateSupportTicketDto) {
  const seller = await getCurrentSellerOrThrow();
  return createSupportTicketRepo(seller.id, dto);
}
