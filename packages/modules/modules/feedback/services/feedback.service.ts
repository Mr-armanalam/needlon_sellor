import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getFeedbackRoadmapItemsRepo,
  toggleRoadmapUpvoteRepo,
  getFeatureCommentsRepo,
  addFeatureCommentRepo,
  submitSellerFeedbackRepo,
  getSellerFeedbacksRepo,
  submitSellerSurveyRepo,
} from "../repository/feedback.repository";
import { CreateFeedbackDto, SubmitSurveyDto } from "../dto/feedback.dto";

export async function getFeedbackRoadmapItemsService(status?: string) {
  const seller = await getCurrentSellerOrThrow();
  return await getFeedbackRoadmapItemsRepo(seller.id, status);
}

export async function toggleRoadmapUpvoteService(featureId: string) {
  const seller = await getCurrentSellerOrThrow();
  return await toggleRoadmapUpvoteRepo(seller.id, featureId);
}

export async function getFeatureCommentsService(featureId: string) {
  return await getFeatureCommentsRepo(featureId);
}

export async function addFeatureCommentService(featureId: string, comment: string) {
  const seller = await getCurrentSellerOrThrow();
  const sellerName = seller.businessName || "Seller";
  return await addFeatureCommentRepo(seller.id, sellerName, featureId, comment);
}

export async function submitSellerFeedbackService(dto: CreateFeedbackDto) {
  const seller = await getCurrentSellerOrThrow();
  return await submitSellerFeedbackRepo(seller.id, dto);
}

export async function getSellerFeedbacksService() {
  const seller = await getCurrentSellerOrThrow();
  return await getSellerFeedbacksRepo(seller.id);
}

export async function submitSellerSurveyService(dto: SubmitSurveyDto) {
  const seller = await getCurrentSellerOrThrow();
  return await submitSellerSurveyRepo(seller.id, dto.rating, dto.feedbackText, dto.context);
}
