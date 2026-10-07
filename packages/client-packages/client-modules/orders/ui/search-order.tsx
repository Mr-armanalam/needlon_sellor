"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface Props {
  setSearchValue: (d: string) => void;
  searchValue: string;
  onSearch: () => void;
}

const SearchOrder = ({ setSearchValue, searchValue, onSearch }: Props) => {
  return (
    <div className="flex max-md:flex-col px-3 md:px-4 font-semibold justify-between">
      <h1 className="text-3xl dark:text-white/90 max-md:pb-1 text-gray-800 font-garamond">Your Orders</h1>
      <div className="flex gap-x-3">
        <InputGroup className="md:min-w-[320px]">
          <InputGroupInput
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder="Search orders"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={onSearch} type="button" className="cursor-pointer">
          Search Orders
        </Button>
      </div>
    </div>
  );
};

export default SearchOrder;
