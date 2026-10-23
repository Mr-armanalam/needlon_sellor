"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Image as ImageIcon,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Shapes,
  Store,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const ADMIN_NAV: readonly NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/executives", label: "Delivery Executives", icon: Users },
  { href: "/delivery-partners", label: "Delivery Partners", icon: Truck },
  { href: "/categories", label: "Categories", icon: Shapes },
  { href: "/sellers", label: "Sellers", icon: Store },
  { href: "/support", label: "Support Inbox", icon: MessagesSquare },
  { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/hero-banners", label: "Hero Banners", icon: ImageIcon },
  { href: "/settings", label: "Platform Settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="scrollbar-slim flex flex-col gap-1 overflow-y-auto pr-1">
      {ADMIN_NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "group relative flex items-center gap-3 rounded-lg bg-white/[0.07] px-3 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/10 transition-colors"
                : "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
            }
          >
            {active && (
              <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-brass-300 to-brass-600" />
            )}
            <Icon
              className={
                active
                  ? "size-[18px] shrink-0 text-brass-400"
                  : "size-[18px] shrink-0 text-white/40 transition-colors group-hover:text-brass-300"
              }
              strokeWidth={1.75}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
