import { redirect } from "next/navigation";

import { getCurrentSeller } from "./current-seller";

export async function requireSeller() {
  const seller =
    await getCurrentSeller();

  if (!seller) {
    redirect("/login");
  }

  return seller;
}