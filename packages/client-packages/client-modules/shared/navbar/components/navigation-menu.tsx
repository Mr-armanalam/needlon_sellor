"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

interface subnevigator {
  name: string;
  description: string;
  link?: string;
}

interface props {
  navigateTrigger: string;
  link: string;
  subNevigator?: subnevigator[];
}

const Navigationmenu = ({ navigateTrigger, subNevigator, link }: props) => {
  if (!subNevigator || subNevigator.length === 0) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={link}>{navigateTrigger}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  const featuredItem = subNevigator[0];
  const listItems = subNevigator.slice(1);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            {navigateTrigger}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[520px] lg:w-[600px] md:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted dark:from-neutral-900/60 dark:to-neutral-800/60 p-5 no-underline outline-none transition-colors hover:shadow-sm focus:shadow-md border dark:border-neutral-800/50"
                    href={featuredItem?.link || link}
                  >
                    <div className="mt-4 mb-1 text-base font-semibold tracking-tight text-foreground">
                      {featuredItem?.name || navigateTrigger}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {featuredItem?.description || "Explore our collection"}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {listItems.map((item, index) => (
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
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigationmenu;

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "#" && pathname.startsWith(String(href)));

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "flex flex-col select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive && "bg-accent/70 text-accent-foreground font-medium",
            className
          )}
          href={href || "#"}
          {...props}
        >
          <div className="text-sm font-semibold leading-none text-foreground">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
