import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { knowledgeBaseArticles } from "@/db/schema/help";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { slugifyText } from "../../shared/slug/slugify";
import type {
  AdminKnowledgeBaseArticleDto,
  CreateKnowledgeBaseArticleDto,
  UpdateKnowledgeBaseArticleDto,
} from "../dto/admin.dto";

/**
 * Admin authoring for knowledge_base_articles. Until now this content only
 * existed via seed/init scripts; these functions are the write side.
 * Seller-side reads (modules/help) only expose isPublished articles, so a
 * draft saved here is invisible to sellers until it is published. The
 * table has no soft-delete column, so delete is a hard delete.
 */

type ArticleRow = typeof knowledgeBaseArticles.$inferSelect;

function toDto(row: ArticleRow): AdminKnowledgeBaseArticleDto {
  return { ...row };
}

async function assertSlugFree(slug: string, excludeId?: string): Promise<void> {
  const [existing] = await db
    .select({ id: knowledgeBaseArticles.id })
    .from(knowledgeBaseArticles)
    .where(eq(knowledgeBaseArticles.slug, slug))
    .limit(1);
  if (existing && existing.id !== excludeId) {
    throw new ConflictError(
      `An article with slug "${slug}" already exists.`,
    );
  }
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function listAdminKnowledgeBaseArticles(options?: {
  publishedOnly?: boolean;
}): Promise<AdminKnowledgeBaseArticleDto[]> {
  const rows = await db
    .select()
    .from(knowledgeBaseArticles)
    .where(
      options?.publishedOnly
        ? eq(knowledgeBaseArticles.isPublished, true)
        : undefined,
    )
    .orderBy(desc(knowledgeBaseArticles.createdAt));
  return rows.map(toDto);
}

export async function getAdminKnowledgeBaseArticle(
  articleId: string,
): Promise<AdminKnowledgeBaseArticleDto> {
  const [article] = await db
    .select()
    .from(knowledgeBaseArticles)
    .where(eq(knowledgeBaseArticles.id, articleId))
    .limit(1);
  if (!article) throw new NotFoundError("Knowledge base article not found.");
  return toDto(article);
}

export async function createAdminKnowledgeBaseArticle(
  dto: CreateKnowledgeBaseArticleDto,
): Promise<AdminKnowledgeBaseArticleDto> {
  const slug = dto.slug ?? slugifyText(dto.title);
  await assertSlugFree(slug);

  const [article] = await db
    .insert(knowledgeBaseArticles)
    .values({
      category: dto.category,
      title: dto.title,
      slug,
      description: dto.description,
      content: dto.content,
      readTime: dto.readTime ?? estimateReadTime(dto.content),
      icon: dto.icon ?? "BookOpen",
      isPublished: dto.isPublished ?? true,
    })
    .returning();

  return toDto(article);
}

export async function updateAdminKnowledgeBaseArticle(
  articleId: string,
  dto: UpdateKnowledgeBaseArticleDto,
): Promise<AdminKnowledgeBaseArticleDto> {
  const existing = await getAdminKnowledgeBaseArticle(articleId);

  if (dto.slug && dto.slug !== existing.slug) {
    await assertSlugFree(dto.slug, articleId);
  }

  const [article] = await db
    .update(knowledgeBaseArticles)
    .set({
      category: dto.category,
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      content: dto.content,
      readTime:
        dto.readTime ??
        (dto.content ? estimateReadTime(dto.content) : undefined),
      icon: dto.icon,
      isPublished: dto.isPublished,
    })
    .where(eq(knowledgeBaseArticles.id, articleId))
    .returning();

  return toDto(article);
}

export async function deleteAdminKnowledgeBaseArticle(
  articleId: string,
): Promise<AdminKnowledgeBaseArticleDto> {
  const existing = await getAdminKnowledgeBaseArticle(articleId);

  const [deleted] = await db
    .delete(knowledgeBaseArticles)
    .where(eq(knowledgeBaseArticles.id, existing.id))
    .returning();

  return toDto(deleted);
}
