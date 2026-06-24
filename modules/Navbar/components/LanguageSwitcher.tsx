"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const languages = {
  hindi: "हिंदी",
  english: "English",
};

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState<string | null>("hindi");
  return (
    <Select value={language} onValueChange={setLanguage} defaultValue={"hindi"}>
      <SelectTrigger className="w-32 cursor-pointer">
        <SelectValue>
          {(value) => languages[value as keyof typeof languages] || "Select..."}
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
