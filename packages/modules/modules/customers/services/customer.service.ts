import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { getSellerCustomersData, getCustomerDetailsRepo } from "../repository/customer.repository";

export async function getSellerCustomersService(search?: string) {
  const seller = await getCurrentSellerOrThrow();
  return getSellerCustomersData(seller.id, search);
}

export async function getSellerCustomerDetailsService(buyerId: string) {
  const seller = await getCurrentSellerOrThrow();
  return getCustomerDetailsRepo(seller.id, buyerId);
}
