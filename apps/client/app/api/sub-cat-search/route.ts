import { MOCK_SUB_CAT_SEARCH_ITEMS } from "@/lib/mock-data-provider";

export const GET = async () => {
  return Response.json({ success: true, items: MOCK_SUB_CAT_SEARCH_ITEMS }, { status: 200 });
};
