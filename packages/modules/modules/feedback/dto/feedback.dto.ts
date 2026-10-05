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
