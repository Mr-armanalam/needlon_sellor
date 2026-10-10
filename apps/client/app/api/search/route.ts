import { NextResponse } from "next/server";
import { SearchService } from "@/modules/home/services/search-service";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    let userId: string | undefined = undefined;
    try {
      const session = await auth();
      userId = session?.user?.id;
    } catch {
      // Unauthenticated search is fine
    }

    const searchResult = await SearchService.searchStorefront(query, userId);
    return NextResponse.json({ searchResult });
  } catch (error) {
    console.error("SEARCH_API_ERROR:", error);
    return NextResponse.json({ searchResult: {} }, { status: 500 });
  }
}
