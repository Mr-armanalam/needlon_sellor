import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

import { requireSeller } from "@/modules/auth/lib/require-seller";
import { cookies } from "next/headers";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request, { params }: Params) {
  try {
    const seller = await requireSeller();

    const { id } = await params;

    const cookieStore = await cookies();

    const currentSessionId = cookieStore.get("session_id")?.value;

    if (id === currentSessionId) {
      return NextResponse.json(
        {
          error: "Use logout instead",
        },
        {
          status: 400,
        },
      );
    }

    const result = await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(sessions.id, id), eq(sessions.sellerId, seller.id)))
      .returning({
        id: sessions.id,
      });

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: "Session not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE_SESSION_ERROR", error);

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
