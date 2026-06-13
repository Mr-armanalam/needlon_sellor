import { ReactNode } from "react";

import { requireSeller } from "@/modules/auth/lib/require-seller";

type Props = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: Props) {
  await requireSeller();

  return children;
}
