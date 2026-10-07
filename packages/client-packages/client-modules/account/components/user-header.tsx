import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

type props ={
  name?:string | undefined | null 
}

const UserHeader = ({name}: props) => {
  return (
    <div className="bg-white rounded-xs px-6 flex shadow-md gap-5 shadow-stone-200 dark:bg-white/6 dark:shadow-gray-600 p-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{name?.charAt(0) ?? 'A'}</AvatarFallback>
      </Avatar>
      <div className=" flex flex-col gap-0.5 justify-center">
        <p className="text-xs">Hello,</p>
        <h2 className="font-semibold">{name}</h2>
      </div>
    </div>
  );
};

export default UserHeader;
