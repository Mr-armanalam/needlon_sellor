import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getSubscriptionPlansList,
  getSellerCurrentSubscription,
  updateSellerSubscriptionPlan,
} from "../repository/subscription.repository";
import { UpdateSubscriptionDto } from "../dto/subscription.dto";

export async function getSubscriptionPlansService() {
  return getSubscriptionPlansList();
}

export async function getSellerSubscriptionService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerCurrentSubscription(seller.id);
}

export async function updateSellerSubscriptionService(dto: UpdateSubscriptionDto) {
  const seller = await getCurrentSellerOrThrow();
  return updateSellerSubscriptionPlan(seller.id, dto);
}
