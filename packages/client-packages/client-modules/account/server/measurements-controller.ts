"use server";

import { db } from "@/db";
import { customerMeasurementsTable } from "@/db/schema/customization/measurements";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { eq, or, sql } from "drizzle-orm";

export const getCustomerMeasurements = async (userId?: string, userEmail?: string) => {
  try {
    if (!userId && !userEmail) return { success: false, data: [] };

    const conditions = [];
    if (userId) conditions.push(eq(customerMeasurementsTable.userId, userId));
    if (userEmail) {
      conditions.push(sql`LOWER(${customerMeasurementsTable.customerEmail}) = ${userEmail.trim().toLowerCase()}`);
    }

    const records = await db
      .select({
        id: customerMeasurementsTable.id,
        orderId: customerMeasurementsTable.orderId,
        gender: customerMeasurementsTable.gender,
        garmentType: customerMeasurementsTable.garmentType,
        measurementUnit: customerMeasurementsTable.measurementUnit,
        essentialMeasurements: customerMeasurementsTable.essentialMeasurements,
        postureSpecifics: customerMeasurementsTable.postureSpecifics,
        fitPreference: customerMeasurementsTable.fitPreference,
        tailorNotes: customerMeasurementsTable.tailorNotes,
        source: customerMeasurementsTable.source,
        status: customerMeasurementsTable.status,
        createdAt: customerMeasurementsTable.createdAt,
        storeName: sellerStore.storeName,
      })
      .from(customerMeasurementsTable)
      .leftJoin(sellerStore, eq(customerMeasurementsTable.sellerId, sellerStore.sellerId))
      .where(or(...conditions))
      .orderBy(sql`${customerMeasurementsTable.createdAt} DESC`);

    return {
      success: true,
      data: records.map((r) => ({
        ...r,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch customer measurements:", error);
    return { success: false, data: [] };
  }
};

export interface SubmitOnlineMeasurementInput {
  userId?: string;
  sellerId?: string;
  orderId?: string;
  orderItemId?: string;
  productId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  gender: string;
  garmentType: string;
  measurementUnit?: string;
  essentialMeasurements: Record<string, any>;
  postureSpecifics?: Record<string, any>;
  fitPreference?: string;
  tailorNotes?: string;
}

export const submitOnlineCustomerMeasurementAction = async (input: SubmitOnlineMeasurementInput) => {
  try {
    if (!input.gender || !input.garmentType) {
      return { success: false, error: "gender and garmentType are required" };
    }

    const [created] = await db
      .insert(customerMeasurementsTable)
      .values({
        userId: input.userId || null,
        sellerId: input.sellerId || null,
        orderId: input.orderId || null,
        orderItemId: input.orderItemId || null,
        productId: input.productId || null,
        customerName: input.customerName || null,
        customerEmail: input.customerEmail || null,
        customerPhone: input.customerPhone || null,
        gender: input.gender,
        garmentType: input.garmentType,
        measurementUnit: input.measurementUnit || "INCHES",
        essentialMeasurements: input.essentialMeasurements || {},
        postureSpecifics: input.postureSpecifics || {},
        fitPreference: input.fitPreference || "REGULAR",
        tailorNotes: input.tailorNotes || null,
        source: "ONLINE_CUSTOMER",
        status: "SUBMITTED",
      })
      .returning();

    return { success: true, data: created };
  } catch (error: any) {
    console.error("Failed to save online customer measurement:", error);
    return { success: false, error: error.message || "Failed to submit measurements" };
  }
};
