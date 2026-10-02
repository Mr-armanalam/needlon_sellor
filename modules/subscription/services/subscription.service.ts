import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
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
  const seller = await getCurrentSeller();
  return getSellerCurrentSubscription(seller.id);
}

export async function updateSellerSubscriptionService(dto: UpdateSubscriptionDto) {
  const seller = await getCurrentSeller();
  return updateSellerSubscriptionPlan(seller.id, dto);
}
