import { NextResponse } from "next/server";
import { auth } from "@/auth";
import * as recoService from "@/modules/home/services/recommendationServices";
import { buildUserPreferenceVector } from "@/lib/recommendation-item";

export async function GET() {
  try {
    let session: any = null;
    try { session = await auth(); } catch { /* auth may fail without DB */ }
    const userId = session?.user?.id;

    // SCENARIO 1: GUEST USER
    if (!userId) {
      try {
        const [recommended, youMayLike] = await Promise.all([
          recoService.getTrendingProducts(),
          recoService.getNewArrivals(),
        ]);
        return NextResponse.json({
          recommended: recommended || [],
          youMayLike: youMayLike || [],
        });
      } catch {
        return NextResponse.json({
          recommended: [],
          youMayLike: [],
        });
      }
    }

    // SCENARIO 2: LOGGED IN USER
    try {
      const prefs = await buildUserPreferenceVector(userId);
      const hasPrefs = prefs.topCategories.length > 0;

      const [personalizedRecs, personalizedLike, trending, arrivals, topRated] = await Promise.all([
        hasPrefs ? recoService.fetchProductsByCategory(prefs.topCategories, 10) : Promise.resolve([]),
        hasPrefs ? recoService.fetchProductsByCategory(prefs.topCategories, 12) : Promise.resolve([]),
        recoService.getTrendingProducts(),
        recoService.getNewArrivals(),
        recoService.getTopRated(),
      ]);

      const finalRecommended = (personalizedRecs.length > 0 ? personalizedRecs : (topRated.length > 0 ? topRated : trending)) || [];
      const finalYouMayLike = (personalizedLike.length > 0 ? personalizedLike : arrivals) || [];

      return NextResponse.json({
        recommended: finalRecommended,
        youMayLike: finalYouMayLike,
      });
    } catch {
      const fallbackTrending = await recoService.getTrendingProducts();
      return NextResponse.json({
        recommended: fallbackTrending || [],
        youMayLike: [],
      });
    }
  } catch (error) {
    console.error("RECOMMENDATION_API_ERROR:", error);
    return NextResponse.json({
      recommended: [],
      youMayLike: [],
    }, { status: 500 });
  }
}