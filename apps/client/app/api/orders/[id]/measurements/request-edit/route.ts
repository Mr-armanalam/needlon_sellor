import { NextRequest, NextResponse } from "next/server";
import { db } from "@needlon/db";
import {
  customerMeasurementsTable,
  type CustomerMeasurementRecord,
} from "@needlon/db/db/schema/customization/measurements";
import { orders } from "@needlon/db/db/schema/orders/table";
import { eq } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderParam } = await params;
    if (!orderParam) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { measurementId, reason } = body;

    let measurement: CustomerMeasurementRecord | null = null;
    if (measurementId && isValidUuid(measurementId)) {
      const [found] = await db
        .select()
        .from(customerMeasurementsTable)
        .where(eq(customerMeasurementsTable.id, measurementId))
        .limit(1);
      measurement = found ?? null;
    }

    if (!measurement) {
      const isUuid = isValidUuid(orderParam);
      let orderId = orderParam;
      if (!isUuid) {
        const [ord] = await db
          .select({ id: orders.id })
          .from(orders)
          .where(eq(orders.orderNumber, orderParam))
          .limit(1);
        if (ord) orderId = ord.id;
      }

      const [foundByOrder] = await db
        .select()
        .from(customerMeasurementsTable)
        .where(eq(customerMeasurementsTable.orderId, orderId))
        .limit(1);
      measurement = foundByOrder ?? null;
    }

    if (!measurement) {
      return NextResponse.json({ error: "Measurement record not found" }, { status: 404 });
    }

    // Flag edit request
    const [updated] = await db
      .update(customerMeasurementsTable)
      .set({
        editRequested: true,
        editRequestReason: reason || "Customer requested measurement change",
        editRequestedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customerMeasurementsTable.id, measurement.id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Edit request submitted to seller successfully",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("REQUEST_EDIT_ERROR:", error);
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "") || "Failed to submit edit request" },
      { status: 500 }
    );
  }
}
