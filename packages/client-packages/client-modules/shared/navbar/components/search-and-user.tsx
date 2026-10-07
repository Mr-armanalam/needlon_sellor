"use client";

/* 

  > Add Cart, wishlist & notification component
  > Add NavSearch component
  > Add Theme toggler
  > Add Auth user UI

*/

import { ModeToggle } from "./theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserSection from "../ui/user-section";
import { NavSearch } from "../ui/nav-search";
import CartAndWishList from "./cart-and-wishlist";

const SearchAndUser = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center space-x-4">
      <CartAndWishList />
      <NavSearch />
      <ModeToggle />
      {session?.user ? (
        <Popover>
          <PopoverTrigger>
            <Avatar
              className="rounded-full cursor-pointer hover:scale-110 w-9.25 h-9.25"
            >
              <AvatarImage
                src={
                  session?.user.image ??
                  "https://avatars.githubusercontent.com/u/12345678?v=4"
                }
                alt="User Avatar"
              />
              <AvatarFallback className="bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full" />
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="mr-6 w-fit">
            <UserSection signOut={signOut} />
          </PopoverContent>
        </Popover>
      ) : (
        <Avatar
          onClick={() => signIn()}
          className="rounded-full hover:scale-110 cursor-pointer w-9.5 h-9.5"
        >
          <AvatarFallback className="bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default SearchAndUser;
