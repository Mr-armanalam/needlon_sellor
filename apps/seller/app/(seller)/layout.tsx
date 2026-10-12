import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { REFRESH_COOKIE } from "@/modules/auth/lib/auth-config";
import Sidebar from "@/modules/Sidebar/main-sidebar";
import TopHeader from "@/modules/top-navbar/TopNavbar";

type Props = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: Props) {
  const currentSeller = await getCurrentSeller();
  if (!currentSeller) {
    const cookieStore = await cookies();
    if (!cookieStore.get(REFRESH_COOKIE)?.value) {
      redirect("/login");
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex w-full overflow-y-auto flex-col">
        <TopHeader />
        {children}
      </div>
    </div>
  );
}
