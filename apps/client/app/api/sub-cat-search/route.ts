import { SearchService } from "@/modules/home/services/search-service";

export const GET = async () => {
  try {
    const items = await SearchService.getSubCatSearchItems();
    return Response.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("SUB_CAT_SEARCH_ERROR:", error);
    return Response.json({ success: false, items: [] }, { status: 500 });
  }
};
