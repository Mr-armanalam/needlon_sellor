import { db } from "@needlon/db";
import {
  feedbackRoadmapItems,
  feedbackUpvotes,
  feedbackComments,
  sellerFeedbacks,
  sellerSurveys,
} from "@needlon/db/db/schema/feedback";
import { eq, and, desc, sql } from "drizzle-orm";

export async function getFeedbackRoadmapItemsRepo(sellerId: string, status?: string) {
  const items = await db
    .select()
    .from(feedbackRoadmapItems)
    .orderBy(desc(feedbackRoadmapItems.upvoteCount));

  // Get seller's active upvotes
  const sellerUpvotes = await db
    .select({ featureId: feedbackUpvotes.featureId })
    .from(feedbackUpvotes)
    .where(eq(feedbackUpvotes.sellerId, sellerId));

  const votedSet = new Set(sellerUpvotes.map((v) => v.featureId));

  const itemsWithVote = items.map((item) => ({
    ...item,
    hasVoted: votedSet.has(item.id),
  }));

  if (status && status !== "all") {
    const filterKey = status.toLowerCase().replace(" ", "-");
    return itemsWithVote.filter(
      (i) => i.status.toLowerCase().replace(" ", "-") === filterKey
    );
  }

  return itemsWithVote;
}

export async function toggleRoadmapUpvoteRepo(sellerId: string, featureId: string) {
  const existing = await db
    .select()
    .from(feedbackUpvotes)
    .where(
      and(
        eq(feedbackUpvotes.featureId, featureId),
        eq(feedbackUpvotes.sellerId, sellerId)
      )
    );

  if (existing.length > 0) {
    // Remove upvote
    await db
      .delete(feedbackUpvotes)
      .where(eq(feedbackUpvotes.id, existing[0].id));

    const [updatedItem] = await db
      .update(feedbackRoadmapItems)
      .set({
        upvoteCount: sql`GREATEST(0, ${feedbackRoadmapItems.upvoteCount} - 1)`,
      })
      .where(eq(feedbackRoadmapItems.id, featureId))
      .returning();

    return { hasVoted: false, item: updatedItem };
  } else {
    // Add upvote
    await db.insert(feedbackUpvotes).values({
      featureId,
      sellerId,
    });

    const [updatedItem] = await db
      .update(feedbackRoadmapItems)
      .set({
        upvoteCount: sql`${feedbackRoadmapItems.upvoteCount} + 1`,
      })
      .where(eq(feedbackRoadmapItems.id, featureId))
      .returning();

    return { hasVoted: true, item: updatedItem };
  }
}

export async function getFeatureCommentsRepo(featureId: string) {
  return await db
    .select()
    .from(feedbackComments)
    .where(eq(feedbackComments.featureId, featureId))
    .orderBy(desc(feedbackComments.createdAt));
}

export async function addFeatureCommentRepo(
  sellerId: string,
  sellerName: string,
  featureId: string,
  comment: string
) {
  const [newComment] = await db
    .insert(feedbackComments)
    .values({
      featureId,
      sellerId,
      sellerName,
      comment,
    })
    .returning();

  await db
    .update(feedbackRoadmapItems)
    .set({
      commentsCount: sql`${feedbackRoadmapItems.commentsCount} + 1`,
    })
    .where(eq(feedbackRoadmapItems.id, featureId));

  return newComment;
}

export async function submitSellerFeedbackRepo(
  sellerId: string,
  payload: {
    title: string;
    category: string;
    priority: string;
    description: string;
    deviceInfo?: string;
    browserInfo?: string;
    appVersion?: string;
  }
) {
  const feedbackNumber = `FB-${Math.floor(100000 + Math.random() * 900000)}`;

  const [feedback] = await db
    .insert(sellerFeedbacks)
    .values({
      sellerId,
      feedbackNumber,
      title: payload.title,
      category: payload.category,
      priority: payload.priority,
      description: payload.description,
      deviceInfo: payload.deviceInfo,
      browserInfo: payload.browserInfo,
      appVersion: payload.appVersion,
      status: "SUBMITTED",
    })
    .returning();

  return feedback;
}

export async function getSellerFeedbacksRepo(sellerId: string) {
  return await db
    .select()
    .from(sellerFeedbacks)
    .where(eq(sellerFeedbacks.sellerId, sellerId))
    .orderBy(desc(sellerFeedbacks.createdAt));
}

export async function submitSellerSurveyRepo(
  sellerId: string,
  rating: number,
  feedbackText?: string,
  context?: string
) {
  const [survey] = await db
    .insert(sellerSurveys)
    .values({
      sellerId,
      rating,
      feedbackText,
      context: context || "Product Listing Workflow",
    })
    .returning();

  return survey;
}
