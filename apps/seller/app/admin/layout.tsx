import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/executives", label: "Delivery Executives" },
  { href: "/admin/delivery-partners", label: "Delivery Partners" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/support", label: "Support Inbox" },
  { href: "/admin/knowledge-base", label: "Knowledge Base" },
  { href: "/admin/hero-banners", label: "Hero Banners" },
  { href: "/admin/settings", label: "Platform Settings" },
] as const;

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const currentSeller = await getCurrentSeller();

  if (!currentSeller) {
    redirect("/login");
  }

  if (currentSeller.role !== "admin") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This section is restricted to platform administrators. Your
            account ({currentSeller.email}) has the{" "}
            <span className="font-medium text-gray-700">
              {currentSeller.role}
            </span>{" "}
            role.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to seller dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className="flex w-64 flex-shrink-0 flex-col justify-between border-r border-gray-100 bg-[#FAFAFA] p-5 font-sans tracking-tight select-none">
        <div>
          <div className="px-2">
            <p className="text-base font-bold text-gray-900">Needlon Admin</p>
            <p className="mt-0.5 text-xs text-gray-400">
              Platform management console
            </p>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-2 text-xs text-gray-400">
          <p className="font-medium text-gray-600">{currentSeller.name}</p>
          <p className="truncate">{currentSeller.email}</p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block font-medium text-gray-600 hover:text-gray-900"
          >
            ← Seller dashboard
          </Link>
        </div>
      </aside>
      <div className="flex w-full flex-col overflow-y-auto bg-slate-50">
        {children}
      </div>
    </div>
  );
}
