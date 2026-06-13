import { cache } from "react";

import { cookies } from "next/headers";

import { eq } from "drizzle-orm";

import { db } from "@/db";

import { seller } from "@/db/schema/seller";

import {
  verifyAccessToken,
  isTokenBlocklisted,
} from "./tokens";

const ACCESS_COOKIE = "access_token";

export const getCurrentSeller = cache(
  async () => {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get(ACCESS_COOKIE)?.value;

    if (!accessToken) {
      return null;
    }

    const payload =
      await verifyAccessToken(accessToken);

    if (!payload) {
      return null;
    }

    const blocked =
      await isTokenBlocklisted(payload.jti);

    if (blocked) {
      return null;
    }

    const result = await db
      .select({
        id: seller.id,
        name: seller.name,
        email: seller.email,
        emailVerified:
          seller.emailVerified,
      })
      .from(seller)
      .where(
        eq(
          seller.id,
          payload.sub
        )
      )
      .limit(1);

    return result[0] ?? null;
  }
);