import { NextRequest, NextResponse } from "next/server";

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { ensureSellerSettings } from "@/modules/seller-profile/server";
import { updateSellerSettingsSchema } from "@/modules/seller-profile/validations/update-seller-settings-schema";
import { updateSellerSettingsService } from "@/modules/seller-profile/server/update-seller-settings";

export async function GET() {
  try {
    const currentSeller = await getCurrentSeller();

    if (!currentSeller) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const settings = await ensureSellerSettings(currentSeller.id);

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET_SELLER_SETTINGS_ERROR", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}




export async function PATCH(req: NextRequest) {
  try {
    const currentSeller = await getCurrentSeller();

    if (!currentSeller) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();

    const parsed = updateSellerSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request.",
          issues: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const existing_settings = await updateSellerSettingsService(
      currentSeller.id,
      parsed.data,
    );


    return NextResponse.json({
      success: true,
      data: existing_settings,
    });
  } catch (error) {
    console.error("PATCH_SELLER_SETTINGS_ERROR", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}