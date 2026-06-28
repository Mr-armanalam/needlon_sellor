import { ReactNode } from "react";

import { requireSeller } from "@/modules/auth/lib/require-seller";
import Sidebar from "@/modules/Sidebar/main-sidebar";
import TopHeader from "@/modules/top-navbar/TopNavbar";

type Props = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: Props) {
  await requireSeller();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex w-full flex-col">
        <TopHeader />
        {children}
      </div>
    </div>
  );
}
