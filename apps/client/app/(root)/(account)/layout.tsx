import { ScrollArea } from "@/components/ui/scroll-area";
import AccountNav from "@/modules/account/shared/account-nav";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-screen lg:bg-zinc-100 lg:dark:bg-black flex gap-4 lg:pl-8 py-2 lg:pr-12 lg:flex-1">
      <div className="lg:flex-[25%] max-md:hidden ">
        <AccountNav />
      </div>
      <ScrollArea className="max-md:flex lg:flex-[75%] h-[98vh] py-8 shadow-sm shadow-stone-100 rounded-xs dark:bg-black dark:shadow-none bg-white">
        {children}
      </ScrollArea>
    </div>
  );
};

export default layout;
