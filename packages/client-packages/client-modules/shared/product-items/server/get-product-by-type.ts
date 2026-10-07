import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export async function getProductByType({
  type,
}: {
  type: "premium" | "recommend" | "user_like" | null;
}) {
  try {
    let data;
    const cookie = await cookies();
    const cookieStore = cookie.toString();

    switch (type) {
      case "premium":
        data = await db
          .select()
          .from(productItems)
          .where(eq(productItems.isPremium, true));
        break;

      case "recommend":
        try {
          const recommendRes = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/home-recommendation`,
            {
              cache: "no-store",
              headers: {
                Cookie: cookieStore,
              },
            }
          );

          const { recommended } = await recommendRes.json();
          data = recommended;
        } catch {
          data = MOCK_PRODUCTS.slice(0, 4);
        }
        break;

      case "user_like":
        try {
          const userLikeRes = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/home-recommendation`,
            { cache: "no-store" }
          );

          const { youMayLike } = await userLikeRes.json();
          data = youMayLike;
        } catch {
          data = MOCK_PRODUCTS.slice(2, 5);
        }
        break;

      default:
        break;
    }

    return data && data.length ? data : MOCK_PRODUCTS;
  } catch (error) {
    console.warn("DB or API fetch failed in getProductByType, using fallback:", error);
    return MOCK_PRODUCTS;
  }
}
