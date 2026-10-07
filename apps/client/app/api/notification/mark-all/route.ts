import { auth } from "@/auth";
import { db } from "@/db";
import { updateSchema } from "@/db/schema/updates";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notification = await db
      .update(updateSchema)
      .set({ read: true })
      .where(and(eq(updateSchema.userId, userId), eq(updateSchema.read, false)))
      .returning();

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
};
