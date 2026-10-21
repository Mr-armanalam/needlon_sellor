import { z } from "zod";

/**
 * Admin surface DTOs. These describe platform-level management operations
 * (delivery partners, categories, sellers, settings) — every route using
 * them is guarded by requireAdmin().
 */

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

export interface AdminOverviewDto {
  sellers: number;
  stores: number;
  buyers: number;
  products: number;
  orders: number;
  executivesByStatus: Record<string, number>;
  shipmentsByStatus: Record<string, number>;
  openSupportTickets: number;
}

// ---------------------------------------------------------------------------
// Delivery partners + shipping methods
// ---------------------------------------------------------------------------

export const partnerIntegrationTypeSchema = z.enum([
  "AGGREGATOR_API",
  "DIRECT_API",
  "MANUAL",
  "INHOUSE",
]);

export const createPartnerSchema = z.object({
  partnerName: z.string().min(2, "Partner name is required"),
  partnerCode: z
    .string()
    .min(2, "Partner code is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Code may only contain letters, digits, - and _"),
  integrationType: partnerIntegrationTypeSchema.optional(),
  apiBaseUrl: z.string().url().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  trackingUrlTemplate: z.string().max(500).nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  supportsCod: z.boolean().optional(),
  supportsPickup: z.boolean().optional(),
  supportsReturn: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});
export type CreatePartnerDto = z.infer<typeof createPartnerSchema>;

export const updatePartnerSchema = createPartnerSchema.partial().extend({
  partnerCode: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Code may only contain letters, digits, - and _")
    .optional(),
  partnerName: z.string().min(2).optional(),
});
export type UpdatePartnerDto = z.infer<typeof updatePartnerSchema>;

export const createShippingMethodSchema = z.object({
  methodName: z.string().min(2, "Method name is required"),
  methodCode: z
    .string()
    .min(2, "Method code is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Code may only contain letters, digits, - and _"),
  description: z.string().nullable().optional(),
  estimatedMinDays: z.number().int().min(0).optional(),
  estimatedMaxDays: z.number().int().min(0).optional(),
  maxWeightKg: z.number().nonnegative().nullable().optional(),
  baseCharge: z.number().nonnegative().optional(),
  perKgCharge: z.number().nonnegative().optional(),
  supportsCod: z.boolean().optional(),
  supportsPickup: z.boolean().optional(),
  supportsReturn: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});
export type CreateShippingMethodDto = z.infer<
  typeof createShippingMethodSchema
>;

export const updateShippingMethodSchema =
  createShippingMethodSchema.partial();
export type UpdateShippingMethodDto = z.infer<
  typeof updateShippingMethodSchema
>;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categoryStatusSchema = z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]);

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required").max(150),
  slug: z.string().min(2).max(180).optional(),
  code: z.string().min(2).max(50).optional(),
  description: z.string().nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  status: categoryStatusSchema.optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(150).optional(),
  slug: z.string().min(2).max(180).optional(),
  description: z.string().nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  status: categoryStatusSchema.optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

// ---------------------------------------------------------------------------
// Sellers
// ---------------------------------------------------------------------------

export interface AdminSellerDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  storeId: string | null;
  storeName: string | null;
  storeVerified: boolean;
  ordersCount: number;
}

export const updateAdminSellerSchema = z
  .object({
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => v.isVerified !== undefined || v.isActive !== undefined, {
    message: "Provide isVerified and/or isActive",
  });
export type UpdateAdminSellerDto = z.infer<typeof updateAdminSellerSchema>;

// ---------------------------------------------------------------------------
// Support inbox (staff side of seller_support_tickets)
// ---------------------------------------------------------------------------

export const supportTicketStatusSchema = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);
export type SupportTicketStatusDto = z.infer<typeof supportTicketStatusSchema>;

export interface AdminSupportMessageDto {
  id: string;
  ticketId: string;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: Date;
}

export interface AdminSupportTicketDto {
  id: string;
  ticketNumber: string;
  sellerId: string;
  sellerName: string;
  storeName: string | null;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assignedAgent: string;
  message: string;
  messageCount: number;
  lastMessage: {
    message: string;
    senderType: string;
    senderName: string;
    createdAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminSupportThreadDto {
  ticket: AdminSupportTicketDto;
  messages: AdminSupportMessageDto[];
}

export const agentReplySchema = z.object({
  message: z.string().min(1, "Reply cannot be empty").max(5000),
});
export type AgentReplyDto = z.infer<typeof agentReplySchema>;

export const updateSupportTicketStatusSchema = z.object({
  status: supportTicketStatusSchema,
});
export type UpdateSupportTicketStatusDto = z.infer<
  typeof updateSupportTicketStatusSchema
>;

// ---------------------------------------------------------------------------
// Knowledge base authoring (knowledge_base_articles)
// ---------------------------------------------------------------------------

export interface AdminKnowledgeBaseArticleDto {
  id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  readTime: string;
  icon: string;
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isPublished: boolean;
  createdAt: Date;
}

export const createKnowledgeBaseArticleSchema = z.object({
  title: z.string().min(3, "Title is required").max(255),
  slug: z.string().min(2).max(255).optional(),
  category: z.string().min(2, "Category is required").max(64),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  readTime: z.string().max(32).optional(),
  icon: z.string().max(64).optional(),
  isPublished: z.boolean().optional(),
});
export type CreateKnowledgeBaseArticleDto = z.infer<
  typeof createKnowledgeBaseArticleSchema
>;

export const updateKnowledgeBaseArticleSchema =
  createKnowledgeBaseArticleSchema.partial().extend({
    title: z.string().min(3).max(255).optional(),
    category: z.string().min(2).max(64).optional(),
    description: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  });
export type UpdateKnowledgeBaseArticleDto = z.infer<
  typeof updateKnowledgeBaseArticleSchema
>;

// ---------------------------------------------------------------------------
// Hero banners (client_hero_banners)
// ---------------------------------------------------------------------------

export interface AdminHeroBannerDto {
  id: string;
  name: string;
  description: string | null;
  image: string;
  offer: string | null;
  slug: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const createHeroBannerSchema = z.object({
  name: z.string().min(2, "Name is required").max(150),
  description: z.string().nullable().optional(),
  image: z.string().min(1, "Image URL is required"),
  offer: z.string().max(100).nullable().optional(),
  slug: z.string().max(150).nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
export type CreateHeroBannerDto = z.infer<typeof createHeroBannerSchema>;

export const updateHeroBannerSchema = createHeroBannerSchema.partial().extend({
  name: z.string().min(2).max(150).optional(),
  image: z.string().min(1).optional(),
});
export type UpdateHeroBannerDto = z.infer<typeof updateHeroBannerSchema>;

// ---------------------------------------------------------------------------
// Platform settings
// ---------------------------------------------------------------------------

export const updatePlatformSettingsSchema = z.object({
  /** Marketplace commission as a fraction in [0, 1) — 0.05 means 5%. */
  commissionRate: z.number().min(0).lt(1),
});
export type UpdatePlatformSettingsDto = z.infer<
  typeof updatePlatformSettingsSchema
>;
