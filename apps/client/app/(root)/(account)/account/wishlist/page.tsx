import WishlistView from "@/modules/account/view/wishlist-view";
import { auth } from "@/auth";

export default async function WishlistPage() {
  const session = await auth();
  const userId = session?.user?.id;

  return <WishlistView userId={userId} />;
}
