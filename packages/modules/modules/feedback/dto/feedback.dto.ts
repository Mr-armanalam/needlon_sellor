import { z } from "zod";

export const createFeedbackSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().default("Feature Request"),
  priority: z.string().default("Medium"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  deviceInfo: z.string().optional(),
  browserInfo: z.string().optional(),
  appVersion: z.string().optional(),
});

export type CreateFeedbackDto = z.infer<typeof createFeedbackSchema>;

export const submitSurveySchema = z.object({
  rating: z.number().min(1).max(5),
  feedbackText: z.string().optional(),
  context: z.string().optional(),
});

export type SubmitSurveyDto = z.infer<typeof submitSurveySchema>;

export const addCommentSchema = z.object({
  comment: z.string().min(2, "Comment must be at least 2 characters"),
});

export type AddCommentDto = z.infer<typeof addCommentSchema>;

/** Roadmap item as returned by the API: a `feedbackRoadmapItems` row plus the seller's vote state. Dates are JSON strings. */
export interface FeedbackRoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  upvoteCount: number;
  commentsCount: number;
  createdAt: string;
  hasVoted: boolean;
  /** Legacy/alternate field names read by the roadmap view. */
  votes?: number;
  desc?: string;
}

/** Comment on a roadmap item (row of `feedbackComments`, JSON-serialised). */
export interface FeedbackComment {
  id: string;
  featureId: string;
  sellerId: string;
  sellerName: string;
  comment: string;
  createdAt: string;
}

/** Unified tracker entry built by the tracker API from a seller feedback or a support ticket. */
export interface FeedbackTrackerItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  type: string;
  createdAt: string;
}

/** Submitted feedback as persisted/returned by the API (row of `sellerFeedbacks`, JSON-serialised). */
export interface SellerFeedback {
  id: string;
  sellerId: string;
  feedbackNumber: string;
  title: string;
  category: string;
  priority: string;
  description: string;
  deviceInfo: string | null;
  browserInfo: string | null;
  appVersion: string | null;
  status: string;
  createdAt: string;
}

/** Payload handed to `onSubmitSuccess`: the persisted feedback when the API returns it, otherwise the submitted form payload. */
export type FeedbackSubmitSuccessPayload = SellerFeedback | CreateFeedbackDto;
