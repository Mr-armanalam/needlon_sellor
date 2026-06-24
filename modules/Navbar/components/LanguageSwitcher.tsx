"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";

const languages = {
  hindi: { label: "हिंदी", icon: "/nav_icon/taj-mahal.png" },
  english: { label: "English", icon: "/nav_icon/flag.png" },
};

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState<string | null>("hindi");
  return (
    <Select value={language} onValueChange={setLanguage} defaultValue={"hindi"}>
      <SelectTrigger className="w-32 cursor-pointer">
        <SelectValue>
          {(value) => (
            <div className="flex items-center justify-between w-full">
              {languages[value as keyof typeof languages]?.label || "Select..."}
              <Image
                src={languages[value as keyof typeof languages]?.icon}
                alt="language"
                height={17}
                width={17}
              />
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem className={"cursor-pointer"} value={"english"}>
          हिंदी
        </SelectItem>
        <SelectItem className={"cursor-pointer"} value="hindi">
          English{" "}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
