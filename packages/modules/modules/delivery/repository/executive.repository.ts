import { hash } from "bcryptjs";
import { and, asc, desc, eq, gte, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { deliveryExecutives } from "@/db/schema/delivery/delivery-executives";
import { deliveryAssignments } from "@/db/schema/delivery/delivery-assignments";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { orders } from "@/db/schema/orders/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { BadRequestError } from "@/modules/shared/errors/bad-request-error";
import { ConflictError } from "@/modules/shared/errors/conflict-error";
import { NotFoundError } from "@/modules/shared/errors/not-found-error";
import type {
  CreateExecutiveDto,
  DeliveryExecutiveStatus,
  ExecutiveDeliveryDto,
  ExecutiveDto,
  UpdateExecutiveDto,
} from "../dto/executive.dto";
import { updateShipmentStatus } from "./delivery.repository";

type DeliveryExecutiveRow = (typeof deliveryExecutives)["$inferSelect"];
type DeliveryAssignmentRow = (typeof deliveryAssignments)["$inferSelect"];

/**
 * Internal auth record — the ONLY shape in this module that carries the
 * password hash. It is used by the login flow and must never be returned
 * from an API route; use ExecutiveDto (toExecutiveDto) for that.
 */
export type ExecutiveAuthRecord = DeliveryExecutiveRow;

export function toExecutiveDto(row: DeliveryExecutiveRow): ExecutiveDto {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    vehicleType: row.vehicleType,
    vehicleNumber: row.vehicleNumber,
    licenseNumber: row.licenseNumber,
    addressLine: row.addressLine,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    status: row.status,
    isAvailable: row.isAvailable,
    hasPassword: row.passwordHash != null,
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const code = (err as { code?: unknown }).code;
  if (code === "23505") return true;
  const cause = (err as { cause?: unknown }).cause;
  return (
    typeof cause === "object" &&
    cause !== null &&
    (cause as { code?: unknown }).code === "23505"
  );
}

const PHONE_TAKEN_MESSAGE =
  "An executive with this phone number already exists";

async function assertPhoneAvailable(
  phone: string,
  exceptExecutiveId?: string,
): Promise<void> {
  const conditions = [eq(deliveryExecutives.phone, phone)];
  if (exceptExecutiveId) {
    conditions.push(ne(deliveryExecutives.id, exceptExecutiveId));
  }
  const [existing] = await db
    .select({ id: deliveryExecutives.id })
    .from(deliveryExecutives)
    .where(and(...conditions))
    .limit(1);
  if (existing) {
    throw new ConflictError(PHONE_TAKEN_MESSAGE);
  }
}

// ---------------------------------------------------------------------------
// Roster CRUD
// ---------------------------------------------------------------------------

/**
 * Create a delivery executive. The password (when supplied) is hashed with
 * bcrypt cost 12 — the same helper and cost the seller signup uses — and
 * only the hash is stored. Executives created through the roster default to
 * ACTIVE (roster creation is an explicit seller/admin act); an explicit
 * status in the input wins. createdBy is the onboarding seller/admin's id,
 * or null for operator-provisioned rows.
 */
export async function createExecutive(
  input: CreateExecutiveDto,
  createdBySellerId: string | null,
): Promise<ExecutiveDto> {
  await assertPhoneAvailable(input.phone);

  const passwordHash = input.password
    ? await hash(input.password, 12)
    : null;

  try {
    const [row] = await db
      .insert(deliveryExecutives)
      .values({
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        passwordHash,
        vehicleType: input.vehicleType ?? null,
        vehicleNumber: input.vehicleNumber ?? null,
        licenseNumber: input.licenseNumber ?? null,
        addressLine: input.addressLine ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        pincode: input.pincode ?? null,
        status: input.status ?? "ACTIVE",
        isAvailable: input.isAvailable ?? true,
        createdBy: createdBySellerId,
      })
      .returning();

    if (!row) {
      throw new Error("Failed to create delivery executive");
    }
    return toExecutiveDto(row);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new ConflictError(PHONE_TAKEN_MESSAGE);
    }
    throw err;
  }
}

export interface ListExecutivesOptions {
  status?: DeliveryExecutiveStatus;
  onlyAvailable?: boolean;
}

/** Roster list: soft-deleted executives are never returned. */
export async function listExecutives(
  options: ListExecutivesOptions = {},
): Promise<ExecutiveDto[]> {
  const conditions = [isNull(deliveryExecutives.deletedAt)];
  if (options.status) {
    conditions.push(eq(deliveryExecutives.status, options.status));
  }
  if (options.onlyAvailable) {
    conditions.push(eq(deliveryExecutives.isAvailable, true));
  }

  const rows = await db
    .select()
    .from(deliveryExecutives)
    .where(and(...conditions))
    .orderBy(asc(deliveryExecutives.name));

  return rows.map(toExecutiveDto);
}

export async function getExecutiveById(
  id: string,
): Promise<ExecutiveDto | null> {
  const [row] = await db
    .select()
    .from(deliveryExecutives)
    .where(
      and(eq(deliveryExecutives.id, id), isNull(deliveryExecutives.deletedAt)),
    )
    .limit(1);
  return row ? toExecutiveDto(row) : null;
}

export async function getExecutiveByPhone(
  phone: string,
): Promise<ExecutiveDto | null> {
  const row = await getExecutiveAuthRecordByPhone(phone);
  return row ? toExecutiveDto(row) : null;
}

/**
 * Full row (including passwordHash) for the login flow only. Soft-deleted
 * executives are treated as non-existent.
 */
export async function getExecutiveAuthRecordByPhone(
  phone: string,
): Promise<ExecutiveAuthRecord | null> {
  const [row] = await db
    .select()
    .from(deliveryExecutives)
    .where(
      and(
        eq(deliveryExecutives.phone, phone),
        isNull(deliveryExecutives.deletedAt),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function updateExecutive(
  id: string,
  patch: UpdateExecutiveDto,
): Promise<ExecutiveDto> {
  const existing = await getExecutiveById(id);
  if (!existing) {
    throw new NotFoundError("Delivery executive not found");
  }

  if (patch.phone && patch.phone !== existing.phone) {
    await assertPhoneAvailable(patch.phone, id);
  }

  const set: Partial<DeliveryExecutiveRow> = { updatedAt: new Date() };
  if (patch.name !== undefined) set.name = patch.name;
  if (patch.phone !== undefined) set.phone = patch.phone;
  if (patch.email !== undefined) set.email = patch.email;
  if (patch.vehicleType !== undefined) set.vehicleType = patch.vehicleType;
  if (patch.vehicleNumber !== undefined) set.vehicleNumber = patch.vehicleNumber;
  if (patch.licenseNumber !== undefined) set.licenseNumber = patch.licenseNumber;
  if (patch.addressLine !== undefined) set.addressLine = patch.addressLine;
  if (patch.city !== undefined) set.city = patch.city;
  if (patch.state !== undefined) set.state = patch.state;
  if (patch.pincode !== undefined) set.pincode = patch.pincode;
  if (patch.status !== undefined) set.status = patch.status;
  if (patch.isAvailable !== undefined) set.isAvailable = patch.isAvailable;
  if (patch.password !== undefined) {
    // Password reset: re-hash, never store the plaintext.
    set.passwordHash = await hash(patch.password, 12);
  }

  try {
    const [row] = await db
      .update(deliveryExecutives)
      .set(set)
      .where(
        and(
          eq(deliveryExecutives.id, id),
          isNull(deliveryExecutives.deletedAt),
        ),
      )
      .returning();
    if (!row) {
      throw new NotFoundError("Delivery executive not found");
    }
    return toExecutiveDto(row);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new ConflictError(PHONE_TAKEN_MESSAGE);
    }
    throw err;
  }
}

/** Soft delete: the row (and its assignment history FKs) stays, flagged
 *  deleted and INACTIVE so it can no longer be assigned or log in. */
export async function softDeleteExecutive(id: string): Promise<ExecutiveDto> {
  const [row] = await db
    .update(deliveryExecutives)
    .set({ deletedAt: new Date(), status: "INACTIVE", updatedAt: new Date() })
    .where(
      and(eq(deliveryExecutives.id, id), isNull(deliveryExecutives.deletedAt)),
    )
    .returning();
  if (!row) {
    throw new NotFoundError("Delivery executive not found");
  }
  return toExecutiveDto(row);
}

// ---------------------------------------------------------------------------
// Executive-facing deliveries + status reporting
// ---------------------------------------------------------------------------

/**
 * The executive's work list: open assignments (ASSIGNED / ACCEPTED /
 * PICKED_UP) plus today's completed deliveries, joined with the shipment,
 * the order, its latest DELIVERY address and its total item count.
 */
export async function getExecutiveDeliveries(
  executiveId: string,
): Promise<ExecutiveDeliveryDto[]> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const rows = await db
    .select({
      assignmentId: deliveryAssignments.id,
      assignmentStatus: deliveryAssignments.status,
      assignedAt: deliveryAssignments.assignedAt,
      acceptedAt: deliveryAssignments.acceptedAt,
      pickedUpAt: deliveryAssignments.pickedUpAt,
      deliveredAt: deliveryAssignments.deliveredAt,
      failureReason: deliveryAssignments.failureReason,
      shipmentId: shipmentOrders.id,
      shipmentStatus: shipmentOrders.status,
      awbNumber: shipmentOrders.awbNumber,
      trackingNumber: shipmentOrders.trackingNumber,
      codAmount: shipmentOrders.codAmount,
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      buyerName: orders.buyerName,
      buyerPhone: orders.buyerPhone,
    })
    .from(deliveryAssignments)
    .innerJoin(
      shipmentOrders,
      eq(deliveryAssignments.shipmentId, shipmentOrders.id),
    )
    .innerJoin(orders, eq(deliveryAssignments.orderId, orders.id))
    .where(
      and(
        eq(deliveryAssignments.executiveId, executiveId),
        or(
          inArray(deliveryAssignments.status, [
            "ASSIGNED",
            "ACCEPTED",
            "PICKED_UP",
          ]),
          and(
            eq(deliveryAssignments.status, "DELIVERED"),
            gte(deliveryAssignments.deliveredAt, startOfToday),
          ),
        ),
      ),
    )
    .orderBy(desc(deliveryAssignments.assignedAt));

  if (rows.length === 0) {
    return [];
  }

  const orderIds = [...new Set(rows.map((r) => r.orderId))];

  // Latest DELIVERY address per order (order_addresses is an append-only
  // snapshot log, so the newest row wins).
  const addressRows = await db
    .select()
    .from(orderAddresses)
    .where(
      and(
        inArray(orderAddresses.orderId, orderIds),
        eq(orderAddresses.addressType, "DELIVERY"),
      ),
    )
    .orderBy(desc(orderAddresses.createdAt));
  const addressByOrderId = new Map<string, (typeof addressRows)[number]>();
  for (const address of addressRows) {
    if (!addressByOrderId.has(address.orderId)) {
      addressByOrderId.set(address.orderId, address);
    }
  }

  const itemCountRows = await db
    .select({
      orderId: orderItems.orderId,
      itemsCount: sql<number>`cast(coalesce(sum(${orderItems.quantity}), 0) as int)`,
    })
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds))
    .groupBy(orderItems.orderId);
  const itemsCountByOrderId = new Map(
    itemCountRows.map((r) => [r.orderId, Number(r.itemsCount)]),
  );

  return rows.map((r) => {
    const address = addressByOrderId.get(r.orderId);
    return {
      assignmentId: r.assignmentId,
      assignmentStatus: r.assignmentStatus,
      assignedAt: r.assignedAt,
      acceptedAt: r.acceptedAt,
      pickedUpAt: r.pickedUpAt,
      deliveredAt: r.deliveredAt,
      failureReason: r.failureReason,
      shipmentId: r.shipmentId,
      shipmentStatus: r.shipmentStatus,
      awbNumber: r.awbNumber,
      trackingNumber: r.trackingNumber,
      codAmount: r.codAmount,
      orderId: r.orderId,
      orderNumber: r.orderNumber,
      buyerName: r.buyerName,
      buyerPhone: r.buyerPhone,
      itemsCount: itemsCountByOrderId.get(r.orderId) ?? 0,
      deliveryAddress: address
        ? {
            recipientName: address.recipientName,
            phoneNumber: address.phoneNumber,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            deliveryNotes: address.deliveryNotes,
          }
        : null,
    };
  });
}

export type ExecutiveReportableStatus =
  | "ACCEPTED"
  | "PICKED_UP"
  | "DELIVERED"
  | "FAILED";

/**
 * Allowed assignment transitions. An assignment moves strictly forward
 * through the delivery lifecycle; FAILED is reachable from any open state.
 * Terminal states (DELIVERED / FAILED / REASSIGNED / CANCELLED) accept no
 * further reports. Note: delivery_assignments has no completed_at column —
 * closure of a row is recorded by its status plus updated_at.
 */
const ASSIGNMENT_TRANSITIONS: Record<
  DeliveryAssignmentRow["status"],
  readonly ExecutiveReportableStatus[]
> = {
  ASSIGNED: ["ACCEPTED", "FAILED"],
  ACCEPTED: ["PICKED_UP", "FAILED"],
  PICKED_UP: ["DELIVERED", "FAILED"],
  DELIVERED: [],
  FAILED: [],
  REASSIGNED: [],
  CANCELLED: [],
};

/**
 * Report a status for one of the executive's own assignments. The
 * assignment row is updated (lifecycle timestamp + failure reason) and the
 * linked shipment is advanced through the delivery repository's
 * updateShipmentStatus — which writes the buyer-visible tracking event and
 * syncs the master order status. ACCEPTED is assignment-only (the parcel
 * has not moved yet).
 */
export async function updateExecutiveAssignmentStatus(
  executiveId: string,
  assignmentId: string,
  nextStatus: ExecutiveReportableStatus,
  note?: string,
): Promise<DeliveryAssignmentRow> {
  const [assignment] = await db
    .select()
    .from(deliveryAssignments)
    .where(
      and(
        eq(deliveryAssignments.id, assignmentId),
        eq(deliveryAssignments.executiveId, executiveId),
      ),
    )
    .limit(1);

  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  const allowed = ASSIGNMENT_TRANSITIONS[assignment.status];
  if (!allowed.includes(nextStatus)) {
    throw new BadRequestError(
      `Cannot move a ${assignment.status} assignment to ${nextStatus}. ` +
        (allowed.length > 0
          ? `Allowed next statuses: ${allowed.join(", ")}.`
          : "This assignment is already closed."),
    );
  }

  const now = new Date();
  const patch: Partial<DeliveryAssignmentRow> = {
    status: nextStatus,
    updatedAt: now,
  };
  if (nextStatus === "ACCEPTED") patch.acceptedAt = now;
  if (nextStatus === "PICKED_UP") patch.pickedUpAt = now;
  if (nextStatus === "DELIVERED") {
    patch.deliveredAt = now;
    patch.completedAt = now;
  }
  if (nextStatus === "FAILED") {
    patch.completedAt = now;
    patch.failureReason = note ?? assignment.failureReason;
  }
  if (note && nextStatus !== "FAILED") {
    patch.notes = note;
  }

  const [updated] = await db
    .update(deliveryAssignments)
    .set(patch)
    .where(eq(deliveryAssignments.id, assignment.id))
    .returning();

  if (!updated) {
    throw new NotFoundError("Assignment not found");
  }

  // Advance the shipment (tracking event + order sync live in
  // updateShipmentStatus). The shipment's own sellerId scopes the update.
  if (nextStatus !== "ACCEPTED") {
    const [shipment] = await db
      .select({
        id: shipmentOrders.id,
        sellerId: shipmentOrders.sellerId,
      })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, assignment.shipmentId))
      .limit(1);

    if (shipment) {
      const shipmentStatus =
        nextStatus === "PICKED_UP"
          ? "OUT_FOR_DELIVERY"
          : nextStatus === "DELIVERED"
            ? "DELIVERED"
            : "DELIVERY_FAILED";
      await updateShipmentStatus(shipment.sellerId, {
        shipmentId: shipment.id,
        status: shipmentStatus,
      });
    }
  }

  return updated;
}
