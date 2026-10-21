import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { shippingPartners } from "@/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@/db/schema/delivery/shipping-method";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
  CreatePartnerDto,
  CreateShippingMethodDto,
  UpdatePartnerDto,
  UpdateShippingMethodDto,
} from "../dto/admin.dto";

type ShippingPartnerRow = typeof shippingPartners.$inferSelect;
type ShippingMethodRow = typeof shippingMethods.$inferSelect;

export interface AdminPartnerDto extends ShippingPartnerRow {
  methodsCount: number;
}

function isUniqueViolation(error: unknown): boolean {
  // Drizzle wraps driver errors (DrizzleQueryError.cause), so walk the
  // cause chain looking for the Postgres unique-violation code.
  let current: unknown = error;
  for (let depth = 0; depth < 5 && typeof current === "object" && current !== null; depth++) {
    if ((current as { code?: unknown }).code === "23505") return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

export async function listAdminPartners(): Promise<AdminPartnerDto[]> {
  const rows = await db
    .select({
      partner: shippingPartners,
      // Raw qualified reference: interpolating the column object would emit
      // an unqualified "id", which inside the subquery binds to
      // shipping_methods.id instead of shipping_partners.id.
      methodsCount: sql<number>`(
        SELECT count(*)::int FROM shipping_methods
        WHERE shipping_methods.partner_id = shipping_partners.id
      )`,
    })
    .from(shippingPartners)
    .orderBy(asc(shippingPartners.displayOrder), asc(shippingPartners.partnerName));

  return rows.map((row) => ({ ...row.partner, methodsCount: row.methodsCount }));
}

export async function getAdminPartner(
  partnerId: string,
): Promise<ShippingPartnerRow> {
  const [partner] = await db
    .select()
    .from(shippingPartners)
    .where(eq(shippingPartners.id, partnerId))
    .limit(1);
  if (!partner) throw new NotFoundError("Shipping partner not found.");
  return partner;
}

export async function createAdminPartner(
  dto: CreatePartnerDto,
): Promise<ShippingPartnerRow> {
  try {
    const [partner] = await db
      .insert(shippingPartners)
      .values({
        partnerName: dto.partnerName,
        partnerCode: dto.partnerCode.toUpperCase(),
        integrationType: dto.integrationType ?? "MANUAL",
        apiBaseUrl: dto.apiBaseUrl ?? null,
        websiteUrl: dto.websiteUrl ?? null,
        trackingUrlTemplate: dto.trackingUrlTemplate ?? null,
        contactEmail: dto.contactEmail ?? null,
        contactPhone: dto.contactPhone ?? null,
        supportsCod: dto.supportsCod ?? false,
        supportsPickup: dto.supportsPickup ?? true,
        supportsReturn: dto.supportsReturn ?? true,
        isActive: dto.isActive ?? true,
        displayOrder: dto.displayOrder ?? 1,
      })
      .returning();
    return partner;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError(
        `A shipping partner with code "${dto.partnerCode.toUpperCase()}" already exists.`,
      );
    }
    throw error;
  }
}

export async function updateAdminPartner(
  partnerId: string,
  dto: UpdatePartnerDto,
): Promise<ShippingPartnerRow> {
  await getAdminPartner(partnerId);
  try {
    const [partner] = await db
      .update(shippingPartners)
      .set({
        ...dto,
        partnerCode: dto.partnerCode?.toUpperCase(),
        updatedAt: new Date(),
      })
      .where(eq(shippingPartners.id, partnerId))
      .returning();
    return partner;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError(
        `A shipping partner with code "${dto.partnerCode?.toUpperCase()}" already exists.`,
      );
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Shipping methods
// ---------------------------------------------------------------------------

export async function listAdminMethods(
  partnerId: string,
): Promise<ShippingMethodRow[]> {
  await getAdminPartner(partnerId);
  return db
    .select()
    .from(shippingMethods)
    .where(eq(shippingMethods.partnerId, partnerId))
    .orderBy(asc(shippingMethods.displayOrder), asc(shippingMethods.methodName));
}

export async function createAdminMethod(
  partnerId: string,
  dto: CreateShippingMethodDto,
): Promise<ShippingMethodRow> {
  await getAdminPartner(partnerId);

  const [duplicate] = await db
    .select({ id: shippingMethods.id })
    .from(shippingMethods)
    .where(eq(shippingMethods.methodCode, dto.methodCode))
    .limit(1);
  if (duplicate) {
    throw new ConflictError(
      `A shipping method with code "${dto.methodCode}" already exists.`,
    );
  }

  const [method] = await db
    .insert(shippingMethods)
    .values({
      partnerId,
      methodName: dto.methodName,
      methodCode: dto.methodCode,
      description: dto.description ?? null,
      estimatedMinDays: dto.estimatedMinDays ?? 1,
      estimatedMaxDays: dto.estimatedMaxDays ?? 3,
      maxWeightKg:
        dto.maxWeightKg === undefined || dto.maxWeightKg === null
          ? null
          : dto.maxWeightKg.toFixed(2),
      baseCharge: (dto.baseCharge ?? 0).toFixed(2),
      perKgCharge: (dto.perKgCharge ?? 0).toFixed(2),
      supportsCod: dto.supportsCod ?? false,
      supportsPickup: dto.supportsPickup ?? true,
      supportsReturn: dto.supportsReturn ?? true,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
      displayOrder: dto.displayOrder ?? 1,
    })
    .returning();
  return method;
}

export async function updateAdminMethod(
  methodId: string,
  dto: UpdateShippingMethodDto,
): Promise<ShippingMethodRow> {
  const [existing] = await db
    .select()
    .from(shippingMethods)
    .where(eq(shippingMethods.id, methodId))
    .limit(1);
  if (!existing) throw new NotFoundError("Shipping method not found.");

  const [method] = await db
    .update(shippingMethods)
    .set({
      methodName: dto.methodName,
      methodCode: dto.methodCode,
      description: dto.description,
      estimatedMinDays: dto.estimatedMinDays,
      estimatedMaxDays: dto.estimatedMaxDays,
      maxWeightKg:
        dto.maxWeightKg === undefined
          ? undefined
          : dto.maxWeightKg === null
            ? null
            : dto.maxWeightKg.toFixed(2),
      baseCharge:
        dto.baseCharge === undefined ? undefined : dto.baseCharge.toFixed(2),
      perKgCharge:
        dto.perKgCharge === undefined ? undefined : dto.perKgCharge.toFixed(2),
      supportsCod: dto.supportsCod,
      supportsPickup: dto.supportsPickup,
      supportsReturn: dto.supportsReturn,
      isDefault: dto.isDefault,
      isActive: dto.isActive,
      displayOrder: dto.displayOrder,
      updatedAt: new Date(),
    })
    .where(eq(shippingMethods.id, methodId))
    .returning();
  return method;
}
