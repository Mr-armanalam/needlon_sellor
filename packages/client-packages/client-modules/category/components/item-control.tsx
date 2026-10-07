/* eslint-disable @typescript-eslint/no-unused-vars */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type param = {
  sort: string;
  category: string;
  setFilterOpen: (data: boolean) => void;
  isFilterHide?: boolean;
};

const ItemControl = ({ sort, category, setFilterOpen, isFilterHide }: param) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    params[key] = value.split(",");
  });

  const removeFilter = (type: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    let values = newParams.get(type)?.split(",") || [];
    values = values.filter((v) => v !== value);
    if (values.length > 0) {
      newParams.set(type, values.join(","));
    } else {
      newParams.delete(type);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  return (
    <div className="flex justify-between items-center max-md:mt-6 mb-6">
      <div className="flex gap-4">
        {Object.entries(params)
          .flatMap(([type, values]) => values.map((value) => ({ type, value })))
          .slice(0, 5)
          .map((filter, i) => (
            <Button
              key={i}
              className="rounded-full border-gray-900 dark:border-gray-400 cursor-pointer"
              variant={"outline"}
            >
              {filter?.value}{" "}
              <span
                onClick={() => removeFilter(filter.type, filter.value)}
                className="text-lg"
              >
                ×
              </span>
            </Button>
          ))}
        {Object.entries(params).flatMap(([_, values]) => values).length > 5 && (
          <Button
            onClick={() => setFilterOpen(true)}
            className="rounded-full text-xl pb-5 cursor-pointer"
            variant={"default"}
          >
            . . .
          </Button>
        )}
        {Object.keys(params).length > 0 && (
          <Button
            onClick={clearAll}
            className="rounded-full cursor-pointer"
            variant={"default"}
          >
            Clear
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <Select
          value={sort}
          onValueChange={(sortby) => {
            const newParams = new URLSearchParams(searchParams.toString());
            let values = newParams.get(category)?.split(",") || [];
            values = values.filter((v) => v === sortby);
            if (values.length > 0) return;
            newParams.set("sort", sortby);
            return router.push(
              `${category}?${newParams.toString()}`
            );
          }}
        >
          <SelectTrigger className="w-50 text-gray-900 dark:text-gray-300 dark:border-gray-400 min-h-10 border-stone-300 shadow-none rounded-xs focus-visible:outline-none h-[60px]">
            <SelectValue className="text-stone-300/70" placeholder="Featured" />
          </SelectTrigger>
          <SelectContent className="rounded-xs gap-y-12">
            <SelectItem value="featured">Sort By: Featured</SelectItem>
            <SelectItem value="priceLow">Price: Low to High</SelectItem>
            <SelectItem value="priceHigh">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Button */}
        {!isFilterHide && <Button
          variant={"secondary"}
          onClick={() => setFilterOpen(true)}
          className="border bg-transparent min-h-10 shadow-none dark:border-gray-400 dark:text-gray-300 border-stone-300 px-4 py-2 rounded-xs text-sm"
        >
          Filter
        </Button>}
      </div>
    </div>
  );
};

export default ItemControl;
