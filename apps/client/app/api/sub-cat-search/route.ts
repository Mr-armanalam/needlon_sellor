/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { subcatSearchItem } from "@/db/schema/sub-cat-search";
import { MOCK_SUB_CAT_SEARCH_ITEMS } from "@/lib/mock-data-provider";

export const GET = async () => {
  try {
    const data = await db.select().from(subcatSearchItem);
    if (!data || data.length === 0)
      return Response.json({ success: true, items: MOCK_SUB_CAT_SEARCH_ITEMS }, { status: 200 });
    return Response.json({ success: true, items: data }, { status: 200 });
  } catch (error: any) {
    console.warn("DB failed in sub-cat-search, using mock fallback:", error.message);
    return Response.json({ success: true, items: MOCK_SUB_CAT_SEARCH_ITEMS }, { status: 200 });
  }
};

