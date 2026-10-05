import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getKnowledgeBaseArticlesRepo,
  getArticleBySlugRepo,
  voteArticleRepo,
  searchHelpCenterRepo,
  updateAcademyProgressRepo,
  getSellerAcademyProgressRepo,
  createCallbackRequestRepo,
} from "../repository/help.repository";

export async function getKnowledgeBaseArticlesService(category?: string) {
  return await getKnowledgeBaseArticlesRepo(category);
}

export async function getArticleBySlugService(slug: string) {
  return await getArticleBySlugRepo(slug);
}

export async function voteArticleService(id: string, isHelpful: boolean) {
  return await voteArticleRepo(id, isHelpful);
}

export async function searchHelpCenterService(query: string) {
  const seller = await getCurrentSellerOrThrow();
  return await searchHelpCenterRepo(seller.id, query);
}

export async function updateAcademyProgressService(itemId: string, itemType: string, progressPercent: number) {
  const seller = await getCurrentSellerOrThrow();
  return await updateAcademyProgressRepo(seller.id, itemId, itemType, progressPercent);
}

export async function getSellerAcademyProgressService() {
  const seller = await getCurrentSellerOrThrow();
  return await getSellerAcademyProgressRepo(seller.id);
}

export async function createCallbackRequestService(phoneNumber: string, preferredTimeSlot: string, reason?: string) {
  const seller = await getCurrentSellerOrThrow();
  return await createCallbackRequestRepo(seller.id, phoneNumber, preferredTimeSlot, reason);
}
