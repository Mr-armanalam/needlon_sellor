import { NextRequest, NextResponse } from "next/server";
import { getSellerProfile } from "@/modules/seller-profile/services";
import {
  scheduleFittingAppointmentRepo,
  getFittingAppointmentsRepo,
} from "@/modules/customers/repository/customer.repository";
import { scheduleFittingAppointmentSchema } from "@/modules/customers/dto/fitting-appointment.dto";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}


export async function GET(request: NextRequest) {
  try {
    const profile = await getSellerProfile();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId") || undefined;
    const customerId = searchParams.get("customerId") || undefined;

    const list = await getFittingAppointmentsRepo(profile.sellerId, orderId, customerId);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("GET_FITTINGS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) || "Failed to load fitting appointments" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getSellerProfile();
    const body = await request.json();
    const parsed = scheduleFittingAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const appointment = await scheduleFittingAppointmentRepo(profile.sellerId, parsed.data);
    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error("POST_FITTINGS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) || "Failed to schedule fitting session" },
      { status: 500 }
    );
  }
}
