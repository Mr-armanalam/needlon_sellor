import { db } from "@needlon/db";
import {
  knowledgeBaseArticles,
  sellerAcademyProgress,
  sellerCallbackRequests,
  sellerSupportTickets,
} from "@needlon/db/db/schema/help";
import { eq, ilike, or, and, sql } from "drizzle-orm";

export async function getKnowledgeBaseArticlesRepo(category?: string) {
  if (category && category !== "all") {
    return await db
      .select()
      .from(knowledgeBaseArticles)
      .where(eq(knowledgeBaseArticles.category, category));
  }
  return await db.select().from(knowledgeBaseArticles);
}

export async function getArticleBySlugRepo(slug: string) {
  const [article] = await db
    .select()
    .from(knowledgeBaseArticles)
    .where(eq(knowledgeBaseArticles.slug, slug));

  if (article) {
    // Increment view count
    await db
      .update(knowledgeBaseArticles)
      .set({ views: article.views + 1 })
      .where(eq(knowledgeBaseArticles.id, article.id));
  }

  return article;
}

export async function voteArticleRepo(id: string, isHelpful: boolean) {
  if (isHelpful) {
    return await db
      .update(knowledgeBaseArticles)
      .set({ helpfulVotes: sql`${knowledgeBaseArticles.helpfulVotes} + 1` })
      .where(eq(knowledgeBaseArticles.id, id))
      .returning();
  } else {
    return await db
      .update(knowledgeBaseArticles)
      .set({ unhelpfulVotes: sql`${knowledgeBaseArticles.unhelpfulVotes} + 1` })
      .where(eq(knowledgeBaseArticles.id, id))
      .returning();
  }
}

export async function searchHelpCenterRepo(sellerId: string, query: string) {
  if (!query || query.trim().length === 0) {
    return { articles: [], tickets: [] };
  }

  const searchTerm = `%${query.trim()}%`;

  const articles = await db
    .select()
    .from(knowledgeBaseArticles)
    .where(
      or(
        ilike(knowledgeBaseArticles.title, searchTerm),
        ilike(knowledgeBaseArticles.description, searchTerm),
        ilike(knowledgeBaseArticles.content, searchTerm)
      )
    )
    .limit(5);

  const tickets = await db
    .select()
    .from(sellerSupportTickets)
    .where(
      and(
        eq(sellerSupportTickets.sellerId, sellerId),
        or(
          ilike(sellerSupportTickets.subject, searchTerm),
          ilike(sellerSupportTickets.message, searchTerm)
        )
      )
    )
    .limit(5);

  return { articles, tickets };
}

export async function updateAcademyProgressRepo(
  sellerId: string,
  itemId: string,
  itemType: string,
  progressPercent: number
) {
  const isCompleted = progressPercent >= 100;
  const existing = await db
    .select()
    .from(sellerAcademyProgress)
    .where(
      and(
        eq(sellerAcademyProgress.sellerId, sellerId),
        eq(sellerAcademyProgress.itemId, itemId)
      )
    );

  if (existing.length > 0) {
    const [updated] = await db
      .update(sellerAcademyProgress)
      .set({
        progressPercent,
        isCompleted,
        updatedAt: new Date(),
      })
      .where(eq(sellerAcademyProgress.id, existing[0].id))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(sellerAcademyProgress)
      .values({
        sellerId,
        itemId,
        itemType,
        progressPercent,
        isCompleted,
      })
      .returning();
    return created;
  }
}

export async function getSellerAcademyProgressRepo(sellerId: string) {
  const records = await db
    .select()
    .from(sellerAcademyProgress)
    .where(eq(sellerAcademyProgress.sellerId, sellerId));

  const totalItems = 4; // 2 videos + 2 core setup milestones
  const completedCount = records.filter((r) => r.isCompleted).length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalItems) * 100) || 65);

  return { records, overallPercent };
}

export async function createCallbackRequestRepo(
  sellerId: string,
  phoneNumber: string,
  preferredTimeSlot: string,
  reason?: string
) {
  const [request] = await db
    .insert(sellerCallbackRequests)
    .values({
      sellerId,
      phoneNumber,
      preferredTimeSlot,
      reason,
      status: "PENDING",
    })
    .returning();
  return request;
}
