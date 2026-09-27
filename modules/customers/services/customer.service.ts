import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getSellerCustomersData, getCustomerDetailsRepo } from "../repository/customer.repository";

export async function getSellerCustomersService(search?: string) {
  const seller = await getCurrentSeller();
  return getSellerCustomersData(seller.id, search);
}

export async function getSellerCustomerDetailsService(buyerId: string) {
  const seller = await getCurrentSeller();
  return getCustomerDetailsRepo(seller.id, buyerId);
}
