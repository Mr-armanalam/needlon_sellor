import { NextResponse } from "next/server";
import { SearchService } from "@/modules/home/services/search-service";
import { auth } from "@/auth";

export async function GET() {
  try {
    let userId: string | undefined = undefined;
    try {
      const session = await auth();
      userId = session?.user?.id;
    } catch {
      // Unauthenticated is fine
    }

    const suggestions = await SearchService.getSuggestions(userId);
    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("SEARCH_SUGGESTION_ERROR:", error);
    return NextResponse.json({ recent: [], suggested: [] }, { status: 500 });
  }
}
