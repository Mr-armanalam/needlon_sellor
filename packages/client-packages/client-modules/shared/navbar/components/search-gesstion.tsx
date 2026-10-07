import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { searchSuggestionProps } from "@/types/product";
import { CornerDownRight } from "lucide-react";
import React from "react";

const SearchSuggestion = ({
  recent,
  heading_name,
  handleOnSelect,
}: searchSuggestionProps) => {
  return (
    <CommandGroup heading={heading_name}>
      {recent.map((item) => (
        <React.Fragment key={item.id}>
          <CommandItem
            onSelect={() => handleOnSelect(item)}
            value={item.id}
            className="mt-1 bg-none"
          >
            <CornerDownRight />
            <span>{item.name}</span>
          </CommandItem>
          <CommandSeparator />
        </React.Fragment>
      ))}
    </CommandGroup>
  );
};

export default SearchSuggestion;
