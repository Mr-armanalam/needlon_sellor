import { count, eq, isNull, notInArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { seller } from "@/db/schema/seller";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";
import { usersTable } from "@/db/schema/users";
import { productsTable } from "@/db/schema/catalog/products/table";
import { orders } from "@/db/schema/orders/table";
import { deliveryExecutives } from "@/db/schema/delivery/delivery-executives";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { sellerSupportTickets } from "@/db/schema/help";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
  AdminOverviewDto,
  AdminSellerDto,
  UpdateAdminSellerDto,
} from "../dto/admin.dto";

// NOTE: this file intentionally imports only "@/db*" and relative paths —
// it is also loaded by the operator script packages/db/scripts/promote-admin.ts,
// whose tsconfig does not define the "@/modules/*" alias.

function toStatusCounts(
  rows: Array<{ status: string; total: number }>,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const row of rows) result[row.status] = row.total;
  return result;
}

/** Platform-wide counts for the admin overview. Real aggregates only. */
export async function getAdminOverview(): Promise<AdminOverviewDto> {
  const [sellerCount] = await db.select({ total: count() }).from(seller);
  const [storeCount] = await db.select({ total: count() }).from(sellerStore);
  const [buyerCount] = await db.select({ total: count() }).from(usersTable);
  const [productCount] = await db
    .select({ total: count() })
    .from(productsTable)
    .where(isNull(productsTable.deletedAt));
  const [orderCount] = await db
    .select({ total: count() })
    .from(orders)
    .where(isNull(orders.deletedAt));

  const executivesByStatusRows = await db
    .select({
      status: deliveryExecutives.status,
      total: sql<number>`count(*)::int`,
    })
    .from(deliveryExecutives)
    .where(isNull(deliveryExecutives.deletedAt))
    .groupBy(deliveryExecutives.status);

  const shipmentsByStatusRows = await db
    .select({
      status: shipmentOrders.status,
      total: sql<number>`count(*)::int`,
    })
    .from(shipmentOrders)
    .groupBy(shipmentOrders.status);

  const [openTickets] = await db
    .select({ total: count() })
    .from(sellerSupportTickets)
    .where(notInArray(sellerSupportTickets.status, ["RESOLVED", "CLOSED"]));

  return {
    sellers: sellerCount?.total ?? 0,
    stores: storeCount?.total ?? 0,
    buyers: buyerCount?.total ?? 0,
    products: productCount?.total ?? 0,
    orders: orderCount?.total ?? 0,
    executivesByStatus: toStatusCounts(executivesByStatusRows),
    shipmentsByStatus: toStatusCounts(shipmentsByStatusRows),
    openSupportTickets: openTickets?.total ?? 0,
  };
}

/** Every seller account with its store, verification state and order volume. */
export async function listAdminSellers(): Promise<AdminSellerDto[]> {
  const rows = await db
    .select({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: sellerProfiles.phoneNumber,
      role: seller.role,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      storeId: sellerStore.id,
      storeName: sellerStore.storeName,
      storeVerified: sellerStore.isVerified,
      // Raw qualified reference: interpolating the column object would emit
      // an unqualified "id", which inside the subquery binds to
      // product_orders.id instead of seller.id.
      ordersCount: sql<number>`(
        SELECT count(*)::int FROM product_orders
        WHERE product_orders.seller_id = seller.id
          AND product_orders.deleted_at IS NULL
      )`,
    })
    .from(seller)
    .leftJoin(sellerProfiles, eq(sellerProfiles.sellerId, seller.id))
    .leftJoin(sellerStore, eq(sellerStore.sellerId, seller.id))
    .orderBy(seller.createdAt);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    role: row.role,
    emailVerified: row.emailVerified,
    isActive: row.isActive,
    createdAt: row.createdAt,
    storeId: row.storeId ?? null,
    storeName: row.storeName ?? null,
    storeVerified: row.storeVerified ?? false,
    ordersCount: row.ordersCount ?? 0,
  }));
}

/**
 * Admin seller management: verify/unverify the seller's store and
 * suspend/reactivate the account (seller.is_active is enforced at login).
 */
export async function updateAdminSeller(
  sellerId: string,
  dto: UpdateAdminSellerDto,
): Promise<AdminSellerDto> {
  const [existing] = await db
    .select({ id: seller.id })
    .from(seller)
    .where(eq(seller.id, sellerId))
    .limit(1);
  if (!existing) throw new NotFoundError("Seller not found.");

  if (dto.isActive !== undefined) {
    await db
      .update(seller)
      .set({ isActive: dto.isActive, updatedAt: new Date() })
      .where(eq(seller.id, sellerId));
  }

  if (dto.isVerified !== undefined) {
    await db
      .update(sellerStore)
      .set({
        isVerified: dto.isVerified,
        verifiedAt: dto.isVerified ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(sellerStore.sellerId, sellerId));
  }

  const sellers = await listAdminSellers();
  const updated = sellers.find((s) => s.id === sellerId);
  if (!updated) throw new NotFoundError("Seller not found.");
  return updated;
}

/**
 * Promote an existing seller account to platform admin by email. This is
 * the only provisioning path for admins: public signup always creates
 * sellers, so the first admin is created by an operator running
 * packages/db/scripts/promote-admin.ts.
 */
export async function promoteSellerToAdmin(
  email: string,
): Promise<{ id: string; name: string; email: string } | null> {
  const normalized = email.trim().toLowerCase();
  const [row] = await db
    .update(seller)
    .set({ role: "admin", updatedAt: new Date() })
    .where(sql`lower(${seller.email}) = ${normalized}`)
    .returning({ id: seller.id, name: seller.name, email: seller.email });
  return row ?? null;
}
