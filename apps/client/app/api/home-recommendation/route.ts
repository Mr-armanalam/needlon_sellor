import { NextResponse } from "next/server";
import { auth } from "@/auth";
import * as recoService from "@/modules/home/services/recommendationServices";
import { buildUserPreferenceVector } from "@/lib/recommendation-item";
import { MOCK_PRODUCTS } from "@/lib/mock-data-provider";

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
          recommended: recommended.length ? recommended : MOCK_PRODUCTS,
          youMayLike: youMayLike.length ? youMayLike : MOCK_PRODUCTS.slice(0, 6),
        });
      } catch {
        return NextResponse.json({
          recommended: MOCK_PRODUCTS,
          youMayLike: MOCK_PRODUCTS.slice(0, 6),
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

      return NextResponse.json({
        recommended: (personalizedRecs.length > 0 ? personalizedRecs : topRated).length
          ? (personalizedRecs.length > 0 ? personalizedRecs : topRated)
          : MOCK_PRODUCTS,
        youMayLike: (personalizedLike.length > 0 ? personalizedLike : arrivals).length
          ? (personalizedLike.length > 0 ? personalizedLike : arrivals)
          : MOCK_PRODUCTS.slice(0, 6),
      });
    } catch {
      return NextResponse.json({
        recommended: MOCK_PRODUCTS,
        youMayLike: MOCK_PRODUCTS.slice(0, 6),
      });
    }

  } catch (error) {
    console.warn("RECOMMENDATION_API_ERROR, returning mock:", error);
    return NextResponse.json({
      recommended: MOCK_PRODUCTS,
      youMayLike: MOCK_PRODUCTS.slice(0, 6),
    });
  }
}