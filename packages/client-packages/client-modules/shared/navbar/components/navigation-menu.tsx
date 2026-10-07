"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface props {
  navigateTrigger: string;
  link: string;
  subNevigator?: subnevigator[];
}

interface subnevigator {
  name: string;
  description: string;
  link?: string;
}

const Navigationmenu = ({ navigateTrigger, subNevigator, link }: props) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {navigateTrigger === "About" ? (
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={link}>{navigateTrigger}</Link>
            </NavigationMenuLink>
          ) : (
            <>
              <NavigationMenuTrigger>{navigateTrigger}</NavigationMenuTrigger>
              <NavigationMenuContent className="w-100">
                <ul className="grid gap-2 group md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                        href={subNevigator?.[0]?.link || link}
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">
                          {subNevigator?.[0]?.name || "Needlon"}
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          {subNevigator?.[0]?.description ||
                            "No description available"}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {subNevigator?.slice(1).map((item, index) => (
                    <ListItem
                      key={index}
                      href={item?.link || "#"}
                      title={item?.name}
                    >
                      {item?.description || "No description available"}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigationmenu;

const ListItem = ({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            pathname.includes(href) && "bg-accent text-accent-foreground",
            "block rounded-md p-3 no-underline outline-hidden select-none focus:bg-accent focus:text-accent-foreground"
          )}
          href={href}
        >
          <div className="font-medium">{title}</div>
          <p className="text-muted-foreground text-sm leading-tight">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
