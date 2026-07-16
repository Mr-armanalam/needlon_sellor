import { ChevronDown } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";

const ProfileDrop = () => {
  return (
    <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-neutral-100/50 transition-all duration-200 group outline-none">
      <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden shadow-sm border border-neutral-200/20">
        {/* Fallback Initials or Avatar Image */}
        <span className="text-white text-[13px] font-semibold tracking-wider">
          AR
        </span>
      </div>

        <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex flex-col items-start gap-0 cursor-pointer">
                <span className="text-[13px] font-medium text-neutral-800 tracking-tight group-hover:text-neutral-900">
                    Arman
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link href="/account/billing">Billing</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href="/account/subscription">Subscription</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

      <ChevronDown
        size={14}
        className="text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 group-hover:translate-y-0.5"
      />
    </div>
  );
};

export default ProfileDrop;
