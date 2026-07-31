import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

export async function GET() {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const timeout = cookieStore.get("inactivity_timeout")?.value || "30";

    return NextResponse.json({
      inactivityTimeout: timeout,
    });
  } catch (error) {
    console.error("GET_SECURITY_PREFERENCES_ERROR", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { inactivityTimeout } = body;

    const cookieStore = await cookies();
    cookieStore.set("inactivity_timeout", String(inactivityTimeout || "30"), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json({
      success: true,
      inactivityTimeout: String(inactivityTimeout),
    });
  } catch (error) {
    console.error("PUT_SECURITY_PREFERENCES_ERROR", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
