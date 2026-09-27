import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { createSupportTicketRepo, getSellerSupportTicketsRepo } from "../repository/support.repository";
import { CreateSupportTicketDto } from "../dto/support.dto";

export async function getSellerSupportTicketsService() {
  const seller = await getCurrentSeller();
  return getSellerSupportTicketsRepo(seller.id);
}

export async function createSupportTicketService(dto: CreateSupportTicketDto) {
  const seller = await getCurrentSeller();
  return createSupportTicketRepo(seller.id, dto);
}
