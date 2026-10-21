import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { clientHeroBannersTable } from "@/db/schema/client/hero-banners";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
  AdminHeroBannerDto,
  CreateHeroBannerDto,
  UpdateHeroBannerDto,
} from "../dto/admin.dto";

/**
 * Admin write side for client_hero_banners. The storefront reads this
 * table through HeroBannerService (active banners only, displayOrder
 * order); until now rows could only be created by seed scripts.
 */

type BannerRow = typeof clientHeroBannersTable.$inferSelect;

function toDto(row: BannerRow): AdminHeroBannerDto {
  return { ...row };
}

export async function listAdminHeroBanners(): Promise<AdminHeroBannerDto[]> {
  const rows = await db
    .select()
    .from(clientHeroBannersTable)
    .orderBy(
      asc(clientHeroBannersTable.displayOrder),
      asc(clientHeroBannersTable.createdAt),
    );
  return rows.map(toDto);
}

export async function getAdminHeroBanner(
  bannerId: string,
): Promise<AdminHeroBannerDto> {
  const [banner] = await db
    .select()
    .from(clientHeroBannersTable)
    .where(eq(clientHeroBannersTable.id, bannerId))
    .limit(1);
  if (!banner) throw new NotFoundError("Hero banner not found.");
  return toDto(banner);
}

export async function createAdminHeroBanner(
  dto: CreateHeroBannerDto,
): Promise<AdminHeroBannerDto> {
  const [banner] = await db
    .insert(clientHeroBannersTable)
    .values({
      name: dto.name,
      description: dto.description ?? null,
      image: dto.image,
      offer: dto.offer ?? null,
      slug: dto.slug ?? null,
      displayOrder: dto.displayOrder ?? 0,
      isActive: dto.isActive ?? true,
    })
    .returning();

  return toDto(banner);
}

export async function updateAdminHeroBanner(
  bannerId: string,
  dto: UpdateHeroBannerDto,
): Promise<AdminHeroBannerDto> {
  const existing = await getAdminHeroBanner(bannerId);

  const [banner] = await db
    .update(clientHeroBannersTable)
    .set({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      offer: dto.offer,
      slug: dto.slug,
      displayOrder: dto.displayOrder,
      isActive: dto.isActive,
      updatedAt: new Date(),
    })
    .where(eq(clientHeroBannersTable.id, existing.id))
    .returning();

  return toDto(banner);
}

export async function deleteAdminHeroBanner(
  bannerId: string,
): Promise<AdminHeroBannerDto> {
  const existing = await getAdminHeroBanner(bannerId);

  const [deleted] = await db
    .delete(clientHeroBannersTable)
    .where(eq(clientHeroBannersTable.id, existing.id))
    .returning();

  return toDto(deleted);
}
