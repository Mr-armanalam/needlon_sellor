import {
  getCommissionRate,
  listPlatformSettingsService,
  setPlatformSetting,
  COMMISSION_RATE_KEY,
} from "@/modules/platform-settings/services/platform-settings.service";
import {
  getAdminOverview,
  listAdminSellers,
  updateAdminSeller,
} from "../repository/admin.repository";
import {
  createAdminPartner,
  createAdminMethod,
  listAdminMethods,
  listAdminPartners,
  updateAdminMethod,
  updateAdminPartner,
} from "../repository/admin-delivery.repository";
import {
  createAdminCategory,
  deleteAdminCategory,
  listAdminCategories,
  updateAdminCategory,
} from "../repository/admin-categories.repository";
import {
  getAdminSupportTicketThread,
  listAdminSupportTickets,
  replyAsAgent,
  setAdminTicketStatus,
} from "../repository/admin-support.repository";
import {
  createAdminKnowledgeBaseArticle,
  deleteAdminKnowledgeBaseArticle,
  listAdminKnowledgeBaseArticles,
  updateAdminKnowledgeBaseArticle,
} from "../repository/admin-knowledge-base.repository";
import {
  createAdminHeroBanner,
  deleteAdminHeroBanner,
  listAdminHeroBanners,
  updateAdminHeroBanner,
} from "../repository/admin-hero-banners.repository";
import type {
  AgentReplyDto,
  CreateCategoryDto,
  CreateHeroBannerDto,
  CreateKnowledgeBaseArticleDto,
  CreatePartnerDto,
  CreateShippingMethodDto,
  SupportTicketStatusDto,
  UpdateAdminSellerDto,
  UpdateCategoryDto,
  UpdateHeroBannerDto,
  UpdateKnowledgeBaseArticleDto,
  UpdatePartnerDto,
  UpdatePlatformSettingsDto,
  UpdateShippingMethodDto,
} from "../dto/admin.dto";

/**
 * Admin services. Every caller (API route or server component) must have
 * passed requireAdmin() / the admin layout guard first — these functions
 * assume an admin actor and only carry the actor's id for audit fields.
 */

export async function getAdminOverviewService() {
  return getAdminOverview();
}

// --- Delivery partners + methods -------------------------------------------

export async function listAdminPartnersService() {
  const partners = await listAdminPartners();
  return { partners };
}

export async function createAdminPartnerService(dto: CreatePartnerDto) {
  return createAdminPartner(dto);
}

export async function updateAdminPartnerService(
  partnerId: string,
  dto: UpdatePartnerDto,
) {
  return updateAdminPartner(partnerId, dto);
}

export async function listAdminMethodsService(partnerId: string) {
  const methods = await listAdminMethods(partnerId);
  return { methods };
}

export async function createAdminMethodService(
  partnerId: string,
  dto: CreateShippingMethodDto,
) {
  return createAdminMethod(partnerId, dto);
}

export async function updateAdminMethodService(
  methodId: string,
  dto: UpdateShippingMethodDto,
) {
  return updateAdminMethod(methodId, dto);
}

// --- Categories --------------------------------------------------------------

export async function listAdminCategoriesService() {
  const categories = await listAdminCategories();
  return { categories };
}

export async function createAdminCategoryService(
  dto: CreateCategoryDto,
  adminId: string,
) {
  return createAdminCategory(dto, adminId);
}

export async function updateAdminCategoryService(
  categoryId: string,
  dto: UpdateCategoryDto,
  adminId: string,
) {
  return updateAdminCategory(categoryId, dto, adminId);
}

export async function deleteAdminCategoryService(categoryId: string) {
  return deleteAdminCategory(categoryId);
}

// --- Sellers -----------------------------------------------------------------

export async function listAdminSellersService() {
  const sellers = await listAdminSellers();
  return { sellers };
}

export async function updateAdminSellerService(
  sellerId: string,
  dto: UpdateAdminSellerDto,
) {
  return updateAdminSeller(sellerId, dto);
}

// --- Support inbox -------------------------------------------------------------

export async function listAdminSupportTicketsService(filter?: {
  status?: string;
  search?: string;
}) {
  const tickets = await listAdminSupportTickets(filter);
  return { tickets };
}

export async function getAdminSupportThreadService(ticketId: string) {
  return getAdminSupportTicketThread(ticketId);
}

export async function replyToSupportTicketService(
  ticketId: string,
  agentSellerId: string,
  dto: AgentReplyDto,
) {
  return replyAsAgent(ticketId, agentSellerId, dto.message);
}

export async function updateSupportTicketStatusService(
  ticketId: string,
  status: SupportTicketStatusDto,
) {
  const ticket = await setAdminTicketStatus(ticketId, status);
  return { ticket };
}

// --- Knowledge base --------------------------------------------------------------

export async function listAdminKnowledgeBaseService() {
  const articles = await listAdminKnowledgeBaseArticles();
  return { articles };
}

export async function createAdminKnowledgeBaseService(
  dto: CreateKnowledgeBaseArticleDto,
) {
  return createAdminKnowledgeBaseArticle(dto);
}

export async function updateAdminKnowledgeBaseService(
  articleId: string,
  dto: UpdateKnowledgeBaseArticleDto,
) {
  return updateAdminKnowledgeBaseArticle(articleId, dto);
}

export async function deleteAdminKnowledgeBaseService(articleId: string) {
  return deleteAdminKnowledgeBaseArticle(articleId);
}

// --- Hero banners ------------------------------------------------------------------

export async function listAdminHeroBannersService() {
  const banners = await listAdminHeroBanners();
  return { banners };
}

export async function createAdminHeroBannerService(dto: CreateHeroBannerDto) {
  return createAdminHeroBanner(dto);
}

export async function updateAdminHeroBannerService(
  bannerId: string,
  dto: UpdateHeroBannerDto,
) {
  return updateAdminHeroBanner(bannerId, dto);
}

export async function deleteAdminHeroBannerService(bannerId: string) {
  return deleteAdminHeroBanner(bannerId);
}

// --- Platform settings ---------------------------------------------------------

export interface AdminSettingsDto {
  commissionRate: number;
  settings: Array<{
    key: string;
    value: unknown;
    updatedBy: string | null;
    updatedAt: Date;
  }>;
}

export async function getAdminSettingsService(): Promise<AdminSettingsDto> {
  const [commissionRate, rows] = await Promise.all([
    getCommissionRate(),
    listPlatformSettingsService(),
  ]);
  return {
    commissionRate,
    settings: rows.map((row) => ({
      key: row.key,
      value: row.value,
      updatedBy: row.updatedBy,
      updatedAt: row.updatedAt,
    })),
  };
}

export async function updateAdminSettingsService(
  dto: UpdatePlatformSettingsDto,
  adminId: string,
): Promise<AdminSettingsDto> {
  await setPlatformSetting(COMMISSION_RATE_KEY, dto.commissionRate, adminId);
  return getAdminSettingsService();
}
